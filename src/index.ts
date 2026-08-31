import { nanoid } from "nanoid";
import { editorHtml } from "./editor";
import { type DocumentData, type PageData, renderDocument } from "./render";
import { CSS } from "./styles";

export interface Env {
	DB: D1Database;
	SCANS: R2Bucket;
}

const KATEX_CSS =
	"https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css";
const FONTS_URL =
	"https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";

function htmlShell(
	title: string,
	content: string,
	url: string,
	date?: string,
): string {
	const origin = new URL(url).origin;
	const fullTitle = `${title}`;
	const desc = date
		? `A document on Sharepoint, published ${date}.`
		: "A document on Sharepoint.";
	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(fullTitle)}</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta name="description" content="${escapeHtml(desc)}">
<meta property="og:site_name" content="Sharepoint">
<meta property="og:title" content="${escapeHtml(fullTitle)}">
<meta property="og:description" content="${escapeHtml(desc)}">
<meta property="og:image" content="${origin}/og.png">
<meta property="og:url" content="${url}">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_URL}" rel="stylesheet">
<link rel="stylesheet" href="${KATEX_CSS}">
<style>${CSS}</style>
</head>
<body>
<header class="topbar">
	<a class="brand" href="/">
		<svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden="true">
			<path d="M2 1.5h14v17l-7-4.4-7 4.4v-17Z" fill="currentColor"/>
		</svg>
		<span>Sharepoint</span>
	</a>
	<div class="actions">
		<button class="btn" id="copyLink">
			<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>
			Copy link
		</button>
	</div>
</header>
<main class="reader" id="reader">${content}</main>
<div class="toast" id="toast"></div>
<script>
function toast(msg){
	const t = document.getElementById("toast");
	t.textContent = msg; t.classList.add("show");
	clearTimeout(toast._t);
	toast._t = setTimeout(() => t.classList.remove("show"), 1800);
}
document.getElementById("copyLink").addEventListener("click", async () => {
	const btn = document.getElementById("copyLink");
	if (btn.dataset.busy) return;
	btn.dataset.busy = "1";
	try {
		await navigator.clipboard.writeText(location.href);
		btn.classList.add("copied");
		btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied';
		setTimeout(() => {
			btn.classList.remove("copied");
			btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg> Copy link';
			delete btn.dataset.busy;
		}, 2000);
	} catch { toast("Copy failed"); delete btn.dataset.busy; }
});
document.getElementById("reader").addEventListener("click", (e) => {
	// Toggle menu
	const menuBtn = e.target.closest(".scan__menu-btn");
	if (menuBtn) {
		const dropdown = menuBtn.nextElementSibling;
		document.querySelectorAll(".scan__menu-dropdown.open").forEach(d => {
			if (d !== dropdown) d.classList.remove("open");
		});
		dropdown.classList.toggle("open");
		return;
	}
	// Download action
	const dlBtn = e.target.closest("[data-dl]");
	if (dlBtn) {
		const img = dlBtn.closest(".scan__canvas").querySelector("img");
		if (!img) { toast("No scan on this page"); return; }
		const a = document.createElement("a");
		a.href = img.src;
		a.download = img.src.split("/").pop() || "page.svg";
		a.click();
		dlBtn.closest(".scan__menu-dropdown").classList.remove("open");
		return;
	}
	// Close menus on outside click
	document.querySelectorAll(".scan__menu-dropdown.open").forEach(d => d.classList.remove("open"));
});
</script>
</body>
</html>`;
}

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

async function getDocument(
	db: D1Database,
	id: string,
): Promise<DocumentData | null> {
	const doc = await db
		.prepare("SELECT id, title, date FROM documents WHERE id = ?")
		.bind(id)
		.first<{ id: string; title: string; date: string }>();

	if (!doc) return null;

	const { results: pages } = await db
		.prepare(
			"SELECT position, markdown, image_key FROM pages WHERE document_id = ? ORDER BY position",
		)
		.bind(id)
		.all<PageData>();

	return { ...doc, pages: pages || [] };
}

async function handleUpload(
	request: Request,
	env: Env,
	origin: string,
): Promise<Response> {
	const formData = await request.formData();
	const file = formData.get("file") as File | null;

	if (!file) {
		return Response.json(
			{ success: false, error: "No file provided" },
			{ status: 400 },
		);
	}

	const key = `${nanoid()}.svg`;
	const buffer = await file.arrayBuffer();

	await env.SCANS.put(key, buffer, {
		httpMetadata: { contentType: file.type || "image/svg+xml" },
	});

	return Response.json({ success: true, key, url: `${origin}/i/${key}` });
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;

		// Normalize trailing slashes (except root) with a redirect
		if (path !== "/" && path.endsWith("/")) {
			url.pathname = path.replace(/\/+$/, "");
			return Response.redirect(url.toString(), 301);
		}

		// Handle CORS preflight
		if (request.method === "OPTIONS") {
			return new Response(null, {
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type",
					"Access-Control-Max-Age": "86400",
				},
			});
		}

		// Upload scan image
		if (path === "/upload" && request.method === "POST") {
			return handleUpload(request, env, url.origin);
		}

		// Serve scan images from R2
		if (path.startsWith("/i/")) {
			const key = path.slice(3);
			const object = await env.SCANS.get(key);
			if (!object) return new Response("Not found", { status: 404 });

			const headers = new Headers();
			object.writeHttpMetadata(headers);
			headers.set("etag", object.httpEtag);
			headers.set("cache-control", "public, max-age=31536000, immutable");

			return new Response(object.body, { headers });
		}

		// Editor UI (share url + /edit)
		if (path.startsWith("/d/") && path.endsWith("/edit")) {
			const id = path.slice(3, -5);
			const doc = await getDocument(env.DB, id);
			if (!doc) return new Response("Document not found", { status: 404 });
			return new Response(editorHtml(url.origin, doc), {
				headers: { "Content-Type": "text/html;charset=utf-8" },
			});
		}

		// Reader view
		if (path.startsWith("/d/")) {
			const id = path.slice(3);
			const doc = await getDocument(env.DB, id);
			if (!doc) return new Response("Document not found", { status: 404 });

			const content = renderDocument(doc);
			return new Response(
				htmlShell(doc.title, content, `${url.origin}/d/${id}`, doc.date),
				{
					headers: { "Content-Type": "text/html;charset=utf-8" },
				},
			);
		}

		// Editor UI (new document)
		if (path === "/new" || path === "/") {
			return new Response(editorHtml(url.origin), {
				headers: { "Content-Type": "text/html;charset=utf-8" },
			});
		}

		// Editor UI (existing document)
		if (path.startsWith("/edit/")) {
			const id = path.slice(6);
			const doc = await getDocument(env.DB, id);
			if (!doc) return new Response("Document not found", { status: 404 });
			return new Response(editorHtml(url.origin, doc), {
				headers: { "Content-Type": "text/html;charset=utf-8" },
			});
		}

		// API: save document
		if (path === "/api/docs" && request.method === "POST") {
			const body = (await request.json()) as {
				title: string;
				date: string;
				pages: { markdown: string; image_key: string }[];
			};

			const id = nanoid();
			const now = Math.floor(Date.now() / 1000);

			await env.DB.prepare(
				"INSERT INTO documents (id, title, date, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
			)
				.bind(id, body.title, body.date, now, now)
				.run();

			for (let i = 0; i < body.pages.length; i++) {
				const page = body.pages[i]!;
				await env.DB.prepare(
					"INSERT INTO pages (id, document_id, position, markdown, image_key, created_at) VALUES (?, ?, ?, ?, ?, ?)",
				)
					.bind(nanoid(), id, i, page.markdown, page.image_key, now)
					.run();
			}

			return Response.json({ success: true, id, url: `${url.origin}/d/${id}` });
		}

		// API: update document
		if (path.startsWith("/api/docs/") && request.method === "PUT") {
			const id = path.slice(10);
			const body = (await request.json()) as {
				title: string;
				date: string;
				pages: { markdown: string; image_key: string }[];
			};

			const now = Math.floor(Date.now() / 1000);

			await env.DB.prepare(
				"UPDATE documents SET title = ?, date = ?, updated_at = ? WHERE id = ?",
			)
				.bind(body.title, body.date, now, id)
				.run();

			await env.DB.prepare("DELETE FROM pages WHERE document_id = ?")
				.bind(id)
				.run();

			for (let i = 0; i < body.pages.length; i++) {
				const page = body.pages[i]!;
				await env.DB.prepare(
					"INSERT INTO pages (id, document_id, position, markdown, image_key, created_at) VALUES (?, ?, ?, ?, ?, ?)",
				)
					.bind(nanoid(), id, i, page.markdown, page.image_key, now)
					.run();
			}

			return Response.json({ success: true, id, url: `${url.origin}/d/${id}` });
		}

		return new Response("Not found", { status: 404 });
	},
};
