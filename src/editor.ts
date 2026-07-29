import type { DocumentData } from "./render";

const FONTS_URL =
	"https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";

const CSS = `
  :root{
    --paper:#F3EFE6; --paper-2:#FBF9F3; --ink:#1C1B19; --ink-soft:#37342F;
    --muted:#77726A; --rule:#D9D2C5; --rule-soft:#E7E1D5;
    --blue:#2559F4; --blue-hover:#1242D4; --radius:10px;
  }
  *{ box-sizing:border-box; }
  body{ margin:0; background:var(--paper); color:var(--ink-soft); font-family:"Inter",system-ui,sans-serif; font-size:15px; line-height:1.5; }
  .topbar{ position:sticky; top:0; z-index:10; display:flex; align-items:center; justify-content:space-between; gap:16px; padding:14px 28px; background:color-mix(in srgb, var(--paper) 88%, transparent); backdrop-filter:saturate(120%) blur(8px); border-bottom:1px solid var(--rule-soft); }
  .brand{ display:inline-flex; align-items:center; gap:9px; font-family:"Newsreader",Georgia,serif; font-weight:600; font-size:1.2rem; color:var(--ink); text-decoration:none; letter-spacing:-0.01em; }
  .brand svg{ display:block; }
  .actions{ display:flex; align-items:center; gap:6px; }
  .icon-btn{
    width:38px; height:38px;
    display:inline-flex; align-items:center; justify-content:center;
    border:0; border-radius:6px;
    background:transparent; color:var(--muted);
    cursor:pointer;
    transition:background .15s ease, color .15s ease;
  }
  .icon-btn:hover{ background:rgba(0,0,0,.05); color:var(--ink); }
  :focus-visible{ outline:2px solid var(--blue); outline-offset:2px; border-radius:6px; }
  .container{ max-width:900px; margin:0 auto; padding:48px 32px 140px; }
  h1{ font-family:"Newsreader",Georgia,serif; font-weight:500; font-size:2.2rem; color:var(--ink); margin:0 0 32px; letter-spacing:-0.01em; }
  .meta-grid{ display:grid; grid-template-columns:2fr 1fr; gap:16px; margin-bottom:48px; }
  .field{ margin-bottom:0; }
  label{ display:block; font-weight:500; font-size:.85rem; color:var(--muted); margin-bottom:8px; text-transform:uppercase; letter-spacing:.04em; }
  input[type="text"], input[type="date"], textarea{
    width:100%; padding:12px 16px; border:1px solid var(--rule); border-radius:var(--radius);
    background:var(--paper-2); font:inherit; color:var(--ink); transition:border-color .15s ease;
  }
  input[type="text"]:focus, input[type="date"]:focus, textarea:focus{
    outline:none; border-color:var(--ink);
  }
  input::placeholder, textarea::placeholder{
    color:color-mix(in srgb, var(--muted) 50%, transparent);
  }
  textarea{ min-height:180px; resize:vertical; font-family:"JetBrains Mono",ui-monospace,monospace; font-size:.85rem; line-height:1.5; }
  .section-title{
    font-family:"Newsreader",Georgia,serif; font-weight:500; font-size:1.4rem;
    color:var(--ink); margin:0 0 20px; letter-spacing:-0.01em;
  }
  .pages{ display:flex; flex-direction:column; gap:24px; margin:0 0 32px; }

  .page-card{
    background:var(--paper-2); border:1px solid var(--rule); border-radius:var(--radius);
    overflow:hidden; transition:box-shadow .2s ease;
  }
  .page-card:hover{ box-shadow:0 2px 12px rgba(30,25,15,.06); }
  .page-card.dragging{ opacity:.4; }

  .page-card.empty{
    background:var(--paper); border:2px dashed var(--rule); border-radius:var(--radius);
    padding:48px 32px; display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:border-color .2s ease, background .2s ease;
  }
  .page-card.empty:hover{ border-color:color-mix(in srgb, var(--ink) 20%, var(--rule)); background:color-mix(in srgb, var(--ink) 3%, var(--paper)); }
  .page-card.empty.dragover{ border-color:color-mix(in srgb, var(--ink) 25%, var(--rule)); background:color-mix(in srgb, var(--ink) 6%, var(--paper)); }
  .page-card.empty svg{ width:32px; height:32px; opacity:.4; }
  .page-card.empty input[type="file"]{ display:none; }

  .page-card.filled{ display:grid; grid-template-columns:1fr 200px; }
  .page-card.filled .card-header{
    grid-column:1/-1; display:flex; align-items:center; justify-content:space-between;
    padding:14px 20px; border-bottom:1px solid var(--rule-soft);
  }
  .page-card.filled .card-header .page-num{
    font-weight:600; font-size:.85rem; color:var(--muted); text-transform:uppercase; letter-spacing:.05em;
  }
  .page-card.filled .card-header .header-actions{
    display:flex; align-items:center; gap:8px;
  }
  .page-card.filled .drag-handle{
    cursor:grab; color:var(--muted); font-size:1rem; user-select:none;
    padding:4px 8px; border-radius:6px; transition:background .15s ease;
  }
  .page-card.filled .drag-handle:hover{ background:rgba(0,0,0,.04); }
  .page-card.filled .drag-handle:active{ cursor:grabbing; }
  .page-card.filled .remove-btn{
    width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center;
    border:0; border-radius:6px; background:transparent; color:var(--muted);
    cursor:pointer; transition:background .15s ease, color .15s ease;
  }
  .page-card.filled .remove-btn:hover{ background:rgba(204,68,68,.08); color:#c44; }
  .page-card.filled .page-fields{ padding:20px; display:flex; flex-direction:column; gap:16px; }
  .page-card.filled .page-fields textarea{ min-height:200px; }
  .page-card.filled .page-preview{
    padding:0; display:flex; flex-direction:column; gap:12px;
    border-left:none; background:none;
  }
  .page-card.filled .page-preview img{
    width:100%; border-radius:6px; border:1px solid var(--rule);
    box-shadow:0 1px 1px rgba(30,25,15,.03), 0 8px 20px -18px rgba(40,32,15,.22);
  }
  .page-card.filled .page-preview .replace-btn{
    font-size:.82rem; color:var(--muted); text-align:center; cursor:pointer;
    padding:8px; margin-top:4px; border-radius:6px; transition:background .15s ease, color .15s ease;
  }
  .page-card.filled .page-preview .replace-btn:hover{ background:rgba(0,0,0,.04); color:var(--ink); }
  .page-card.filled .page-preview input[type="file"]{ display:none; }

  .btn{
    font:inherit; font-size:.92rem; font-weight:500; border:0; cursor:pointer;
    border-radius:6px; padding:9px 16px; display:inline-flex; align-items:center; gap:8px;
    color:#fff; background:var(--ink);
    transition:filter .15s ease, transform .1s ease, background .2s ease;
  }
  .btn:hover{ filter:brightness(1.15); }
  .btn:active{ transform:scale(.97); }
  .btn.copied{ background:var(--blue); pointer-events:none; }
  .btn.copied svg{ transform:scale(1.15); }
  .btn svg{ display:block; transition:transform .2s ease; }
  .btn.secondary{ background:var(--muted); }
  .btn.publish{ background:var(--blue); }
  .btn.publish:hover{ background:var(--blue-hover); }
  .btn.ghost{
    background:transparent;
    color:var(--ink);
    border:0;
  }
  .btn.ghost:hover{ background:rgba(28,27,25,.05); }
  .btn.ghost:active{ background:transparent; }
  .toast{
    position:fixed; left:50%; bottom:28px; transform:translateX(-50%) translateY(12px);
    background:var(--ink); color:#fff; font-size:.88rem; padding:9px 16px; border-radius:6px;
    opacity:0; pointer-events:none; transition:opacity .2s ease, transform .2s ease;
  }
  .toast.show{ opacity:1; transform:translateX(-50%) translateY(0); }
  @media (max-width:768px){
    .meta-grid{ grid-template-columns:1fr; }
    .page-card.filled{ grid-template-columns:1fr; }
    .page-card.filled .page-preview{ border-top:1px solid var(--rule-soft); }
    .container{ padding:32px 20px 100px; }
  }
`;

function clientJs(publicUrl: string, docJson: string): string {
	return `
const PUBLIC_URL = "${publicUrl}";
const DOC = ${docJson};
let pages = DOC ? DOC.pages.map(p => ({ markdown: p.markdown, image_key: p.image_key })) : [];
let draggedIndex = null;

const titleEl = document.getElementById("title");
titleEl.addEventListener("input", () => {
	document.title = titleEl.value ? "~ " + titleEl.value : "~ " + (DOC ? "Edit Document" : "New Document");
});

const PLACEHOLDERS = [
	"Your greatest literary work...",
	"What will you put here?",
	"A descriptive title? or a fanciful title?",
	"This is a really awesome placeholder title!",
	"A book not yet written but with a sick title",
];
titleEl.placeholder = PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)];

function toast(msg){
	const t = document.getElementById("toast");
	t.textContent = msg; t.classList.add("show");
	clearTimeout(toast._t);
	toast._t = setTimeout(() => t.classList.remove("show"), 1800);
}

async function uploadFile(file, index) {
	const fd = new FormData();
	fd.append("file", file);
	const res = await fetch("/upload", { method: "POST", body: fd });
	const data = await res.json();
	if (data.success) {
		pages[index].image_key = data.key;
		render();
		toast("Scan uploaded");
	} else {
		toast("Upload failed");
	}
}

async function uploadFiles(files, startIndex) {
	let index = startIndex;
	const dateEl = document.getElementById("date");
	for (const file of files) {
		while (index >= pages.length) {
			pages.push({ markdown: "", image_key: "" });
		}
		while (index < pages.length && pages[index].image_key) {
			index++;
			while (index >= pages.length) {
				pages.push({ markdown: "", image_key: "" });
			}
		}
		await uploadFile(file, index);
		// Prefill date from first file's lastModified
		if (!dateEl.value && file.lastModified) {
			const d = new Date(file.lastModified);
			dateEl.value = d.toISOString().slice(0, 10);
		}
		index++;
	}
	if (pages.length === 0 || pages[pages.length - 1].image_key) {
		pages.push({ markdown: "", image_key: "" });
	}
	render();
}

function parseAndDistribute(text, startIndex) {
	let md = text.trim();
	const titleEl = document.getElementById("title");

	// Extract # Title from the top
	const titleMatch = md.match(/^#\\s+(.+?)(\\n|$)/);
	if (titleMatch) {
		if (!titleEl.value) titleEl.value = titleMatch[1].trim();
		md = md.slice(titleMatch[0].length).trim();
	}

	// Split on --- delimiters
	const sections = md.split(/^---\\s*$/m).map(s => s.trim()).filter(Boolean);

	// Distribute to existing pages with images
	let pageIdx = startIndex;
	for (const section of sections) {
		// Find the next page with an image starting from pageIdx
		while (pageIdx < pages.length && !pages[pageIdx].image_key) pageIdx++;
		if (pageIdx >= pages.length) break; // drop extras
		pages[pageIdx].markdown = section;
		pageIdx++;
	}

	render();
	toast("Distributed " + sections.length + " page" + (sections.length > 1 ? "s" : ""));
}

function render(){
	const titleEl = document.getElementById("title");
	const dateEl = document.getElementById("date");
	// Only prefill from DOC if the fields are empty (first load)
	if (!titleEl.value && DOC?.title) titleEl.value = DOC.title;
	if (!dateEl.value && DOC?.date) dateEl.value = DOC.date;

	const container = document.getElementById("pages");
	container.innerHTML = pages.map((p, i) => {
		if (!p.image_key) {
			return \`
				<label class="page-card empty" data-index="\${i}">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
					<input type="file" accept="image/*,.svg" data-index="\${i}" multiple>
				</label>
			\`;
		}
		return \`
			<div class="page-card filled" draggable="true" data-index="\${i}">
				<div class="card-header">
					<span class="page-num">Page \${i + 1}</span>
					<div class="header-actions">
						<span class="drag-handle">⠿</span>
						<button class="remove-btn" data-action="remove" data-index="\${i}" title="Remove page">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
						</button>
					</div>
				</div>
				<div class="page-fields">
					<textarea data-field="markdown" data-index="\${i}" placeholder="Paste transcribed markdown here...">\${p.markdown}</textarea>
				</div>
				<div class="page-preview">
					<img src="/i/\${p.image_key}" alt="Scan">
					<label class="replace-btn">Replace scan<input type="file" accept="image/*,.svg" data-index="\${i}" multiple></label>
				</div>
			</div>
		\`;
	}).join("");

	container.querySelectorAll("textarea").forEach(t => {
		t.addEventListener("input", e => {
			pages[+e.target.dataset.index].markdown = e.target.value;
		});
		t.addEventListener("paste", e => {
			const text = e.clipboardData?.getData("text");
			if (!text || !text.includes("---")) return;
			e.preventDefault();
			parseAndDistribute(text, +t.dataset.index);
		});
	});
	container.querySelectorAll('[data-action="remove"]').forEach(b => {
		b.addEventListener("click", e => {
			pages.splice(+e.target.dataset.index, 1);
			render();
		});
	});
	container.querySelectorAll('input[type="file"]').forEach(f => {
		f.addEventListener("change", async e => {
			const files = Array.from(e.target.files);
			if (!files.length) return;
			await uploadFiles(files, +e.target.dataset.index);
		});
	});

	container.querySelectorAll(".page-card.filled").forEach(card => {
		card.addEventListener("dragstart", e => {
			draggedIndex = +card.dataset.index;
			card.classList.add("dragging");
		});
		card.addEventListener("dragend", () => {
			card.classList.remove("dragging");
			draggedIndex = null;
		});
		card.addEventListener("dragover", e => e.preventDefault());
		card.addEventListener("drop", e => {
			e.preventDefault();
			const targetIndex = +card.dataset.index;
			if (draggedIndex === null || draggedIndex === targetIndex) return;
			const [moved] = pages.splice(draggedIndex, 1);
			pages.splice(targetIndex, 0, moved);
			render();
		});
	});

	container.querySelectorAll(".page-card.empty").forEach(zone => {
		zone.addEventListener("dragover", e => {
			e.preventDefault();
			zone.classList.add("dragover");
		});
		zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));
		zone.addEventListener("drop", async e => {
			e.preventDefault();
			zone.classList.remove("dragover");
			const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/") || f.name.endsWith(".svg"));
			if (!files.length) return;
			await uploadFiles(files, +zone.dataset.index);
		});
	});
}

window.addEventListener("paste", async e => {
	const items = e.clipboardData?.items;
	if (!items) return;
	const files = [];
	for (const item of items) {
		if (item.type.startsWith("image/")) {
			const file = item.getAsFile();
			if (file) files.push(file);
		}
	}
	if (files.length) {
		const emptyIndex = pages.findIndex(p => !p.image_key);
		await uploadFiles(files, emptyIndex === -1 ? pages.length : emptyIndex);
	}
});

document.getElementById("copyPrompt").addEventListener("click", async () => {
	const btn = document.getElementById("copyPrompt");
	if (btn.dataset.busy) return;
	btn.dataset.busy = "1";
	const text = document.getElementById("promptText").textContent;
	try {
		await navigator.clipboard.writeText(text);
		btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied';
		setTimeout(() => {
			btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy prompt';
			delete btn.dataset.busy;
		}, 1500);
	} catch { toast("Copy failed"); delete btn.dataset.busy; }
});

document.getElementById("save").addEventListener("click", async () => {
	const title = document.getElementById("title").value;
	const date = document.getElementById("date").value;

	const filledPages = pages.filter(p => p.image_key || p.markdown.trim());

	if (!title || !date || filledPages.length === 0) {
		toast("Fill in title, date, and add at least one page");
		return;
	}

	const method = DOC ? "PUT" : "POST";
	const url = DOC ? "/api/docs/" + DOC.id : "/api/docs";

	const res = await fetch(url, {
		method,
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ title, date, pages: filledPages }),
	});
	const data = await res.json();
	if (data.success) {
		toast("Saved!");
		setTimeout(() => location.href = data.url, 800);
	} else {
		toast("Save failed");
	}
});

if (pages.length === 0) pages.push({ markdown: "", image_key: "" });
render();
`;
}

export function editorHtml(publicUrl: string, doc?: DocumentData): string {
	const docJson = doc ? JSON.stringify(doc) : "null";
	const viewLink = doc
		? `<a class="btn secondary" href="/d/${doc.id}" style="text-decoration:none;">View</a>`
		: "";

	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${doc ? "~ Edit Document" : "~ New Document"}</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:title" content="Sharepoint">
<meta property="og:description" content="Document sharing and viewing">
<meta property="og:image" content="${publicUrl}/og.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_URL}" rel="stylesheet">
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
		<button class="btn ghost" id="copyPrompt" title="Copy transcription prompt">
			<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
			Copy prompt
		</button>
		${viewLink}
		<button class="btn publish" id="save">${doc ? "Update" : "Publish"}</button>
	</div>
</header>
<div class="container">
	<h1>${doc ? "Edit Document" : "New Document"}</h1>

	<div class="meta-grid">
		<div class="field">
			<label for="title">Title</label>
			<input type="text" id="title" placeholder="Your greatest literary work">
		</div>
		<div class="field">
			<label for="date">Date</label>
			<input type="date" id="date">
		</div>
	</div>

	<h2 class="section-title">Pages</h2>
	<div class="pages" id="pages"></div>
</div>
<pre id="promptText" style="display:none;">Transcribe these handwritten pages into clean markdown. Rules:

- Start with a # heading as the document title
- Use ## for section headings
- Use - for bullet points
- Use $...$ for inline LaTeX and $$...$$ for display LaTeX
- Use \`\`\` for code blocks
- Fix any spelling mistakes rather than transcribing them literally
- Keep the tone and meaning faithful to the original
- If there are sketches or images describe them; if they are easily drawn with an ascii diagram then provide one in a code block otherwise just describe it. Don't mistake special symbols for drawings though.
- If multiple images are provided, separate each page's transcription with --- on its own line
- Output only the markdown, no commentary, enclose in a codeblock for ease of copying</pre>
<div class="toast" id="toast"></div>

<script>${clientJs(publicUrl, docJson)}</script>
</body>
</html>`;
}
