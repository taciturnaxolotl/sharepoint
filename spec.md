# Handwriting Reader — Spec

A share-style reader for handwritten pages: transcribed text on the left,
the original handwriting scan (SVG) on the right, one row per page. Modeled
on the reMarkable share layout. Static, self-contained HTML — no build step,
no server, no browser storage.

## Layout

- **Top bar** — brand name (left), *Copy link* + overflow menu (right). Sticky.
- **Reader** — a vertical stack of *spreads*, one per page. Each spread is a
  two-column grid: transcription (left) and scan (right), top-aligned.
- **Scan column** is `position: sticky`, so a tall transcription scrolls past
  a pinned scan. The first spread's text column carries the document header
  (date eyebrow + serif title with a left rule).
- Collapses to a single stacked column below ~880px.

## Data model

Everything renders from one object. The import flow produces this; the UI only reads it.

```js
DOC = {
  brand: string,                 // top-bar label
  pages: Page[]                  // one entry per handwriting page
}

Page = {
  header?: {                     // usually only on pages[0]
    date:  string,
    title: string
  },
  text: string,                  // HTML for the left column (see below)
  svg:  string                   // the paired scan (see below)
}
```

Every page is assumed to have **both** `text` and `svg` — pairing happens at
import time, so the UI does not handle missing scans or empty states.

## Content rules

**`text`** is an HTML string. Supported/expected tags:
- `<p>`, `<h2>` (section labels), `<ul>/<li>`, `<a>`, inline `<code>`
- **Math (LaTeX via KaTeX):** inline `$…$` or `\(…\)`; display `$$…$$` or `\[…\]`.
  Typesetting runs after render and **skips `pre` and `code`**, so literal `$`
  in diagrams/snippets is safe.
- **ASCII diagrams:** a `<pre>` block. Monospace, whitespace preserved,
  `tab-size: 2`, line-height tuned so box-drawing characters connect.

**`svg`** is either:
- an inline SVG string (`<svg …>…</svg>` or `<?xml …`) — **preferred**; stays
  crisp at any zoom and enables per-page download, or
- a path/URL to an `.svg` or image file — rendered via `<img>`.

Detection is by leading token (`<svg`/`<?xml` → inline, else treated as a URL).

## Interactions

- **Copy link** — copies `location.href`, shows a toast.
- **Per-scan download** — chip in the scan's top-right corner, revealed on
  hover (always visible on touch / keyboard focus). Downloads inline SVG as a
  Blob (`page-N.svg`) or the referenced file directly.

## Import contract

The import flow is responsible for:
1. Pairing each handwriting page with its transcription, in reading order.
2. Emitting one `Page` per scan; attaching `header` to `pages[0]`.
3. Emitting transcription as the HTML subset above — math as `$…$`/`$$…$$`,
   diagrams wrapped in `<pre>`.
4. Preferring inline SVG for scans.

## Dependencies & constraints

- **KaTeX** (CSS + JS + auto-render) loaded from CDN. The typeset pass no-ops
  if it fails to load, degrading to raw `$…$` text — **vendor KaTeX locally**
  for offline/air-gapped hosting.
- Fonts: Newsreader (title), Inter (body), JetBrains Mono (diagrams) via Google
  Fonts; swap for self-hosted if needed.
- No `localStorage`/`sessionStorage` or other browser storage.

## Theming

Single-line changes at the top of the file: `DOC.brand` (top-bar label) and the
`--blue` CSS variable (primary action colour). Full palette lives in `:root`.