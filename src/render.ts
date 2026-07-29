import { marked } from "marked";
import katex from "katex";

marked.use({
	breaks: true,
	gfm: true,
});

function renderMath(html: string): string {
	// Display math: $$...$$
	html = html.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
		try {
			return katex.renderToString(tex.trim(), { displayMode: true, throwOnError: false });
		} catch {
			return `<code>${tex}</code>`;
		}
	});

	// Inline math: $...$ (but not inside code blocks or pre)
	html = html.replace(/(?<!<code[^>]*>)\$([^$\n]+?)\$(?![^<]*<\/code>)/g, (_, tex) => {
		try {
			return katex.renderToString(tex.trim(), { displayMode: false, throwOnError: false });
		} catch {
			return `<code>${tex}</code>`;
		}
	});

	return html;
}

export function renderMarkdown(md: string): string {
	const html = marked.parse(md) as string;
	return renderMath(html);
}

export interface PageData {
	position: number;
	markdown: string;
	image_key: string;
}

export interface DocumentData {
	id: string;
	title: string;
	date: string;
	brand: string;
	pages: PageData[];
}

export function renderDocument(doc: DocumentData): string {
	const pages = doc.pages.map((page, i) => {
		const header = i === 0
			? `<p class="eyebrow">${escapeHtml(doc.date)}</p>
			   <h1 class="title">${escapeHtml(doc.title)}</h1>`
			: "";

		const content = renderMarkdown(page.markdown);
		const imageUrl = `/i/${page.image_key}`;

		const ext = page.image_key?.split(".").pop()?.toUpperCase() || "Image";

		return `
			<section class="spread">
				<div class="prose">
					${header}
					${content}
				</div>
				<aside class="scan">
					<div class="scan__meta"><span class="scan__page">Page ${i + 1} / ${doc.pages.length}</span></div>
					<div class="scan__canvas">
						<div class="scan__menu">
							<button class="scan__menu-btn" aria-label="Page options">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
							</button>
							<div class="scan__menu-dropdown">
								<button data-dl="${i}">
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
									Download ${ext}
								</button>
							</div>
						</div>
						<img src="${imageUrl}" alt="Handwritten page scan" loading="lazy">
					</div>
				</aside>
			</section>`;
	}).join("");

	return pages;
}

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}
