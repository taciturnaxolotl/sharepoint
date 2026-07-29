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

		return `
			<section class="spread">
				<div class="prose">
					${header}
					${content}
				</div>
				<aside class="scan">
					<div class="scan__meta"><span class="scan__page">Page ${i + 1} / ${doc.pages.length}</span></div>
					<div class="scan__canvas">
						<button class="icon-btn scan__dl" data-dl="${i}" aria-label="Download page ${i + 1}">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v11"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>
						</button>
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
