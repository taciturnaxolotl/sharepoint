export const CSS = `
  :root{
    --paper:#F3EFE6;
    --paper-2:#FBF9F3;
    --ink:#1C1B19;
    --ink-soft:#37342F;
    --muted:#77726A;
    --rule:#D9D2C5;
    --rule-soft:#E7E1D5;
    --dot:#DBD5C8;
    --blue:#2559F4; --blue-hover:#1242D4;
    --radius:8px;
    --measure:52ch;
  }

  *{ box-sizing:border-box; }
  html{ -webkit-text-size-adjust:100%; }

  body{
    margin:0;
    background:var(--paper);
    color:var(--ink-soft);
    font-family:"Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
    font-size:17px;
    line-height:1.62;
    -webkit-font-smoothing:antialiased;
    text-rendering:optimizeLegibility;
  }

  .topbar{
    position:sticky;
    top:0;
    z-index:10;
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:16px;
    padding:14px 28px;
    background:color-mix(in srgb, var(--paper) 88%, transparent);
    backdrop-filter:saturate(120%) blur(8px);
    border-bottom:1px solid var(--rule-soft);
  }
  .brand{
    display:inline-flex;
    align-items:center;
    gap:9px;
    font-family:"Newsreader", Georgia, serif;
    font-weight:600;
    font-size:1.2rem;
    color:var(--ink);
    letter-spacing:-0.01em;
    text-decoration:none;
  }
  .brand svg{ display:block; }
  .actions{ display:flex; align-items:center; gap:6px; }

  .btn{
    font:inherit;
    font-size:.92rem;
    font-weight:500;
    border:0;
    cursor:pointer;
    border-radius:6px;
    padding:9px 16px;
    display:inline-flex;
    align-items:center;
    gap:8px;
    color:#fff;
    background:var(--blue);
    transition:filter .15s ease, transform .1s ease, background .2s ease;
  }
  .btn:hover{ filter:brightness(1.06); }
  .btn:active{ transform:scale(.97); }
  .btn.copied{
    background:var(--blue);
    pointer-events:none;
  }
  .btn svg{
    display:block;
    transition:transform .2s ease;
  }
  .btn.copied svg{
    transform:scale(1.15);
  }

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

  .reader{
    max-width:1240px;
    margin:0 auto;
    padding:46px 40px 120px;
  }

  .spread{
    display:grid;
    grid-template-columns:minmax(0,1.15fr) minmax(0,0.85fr);
    gap:56px;
    align-items:start;
    padding-block:40px;
  }
  .spread + .spread{ border-top:1px solid var(--rule-soft); }
  .spread:first-child{ padding-top:8px; }

  .prose{ max-width:var(--measure); }
  .eyebrow{
    font-size:.9rem;
    color:var(--muted);
    letter-spacing:.01em;
    margin:0 0 18px;
  }
  .title{
    font-family:"Newsreader", Georgia, serif;
    font-weight:500;
    font-size:clamp(2.3rem, 4.2vw, 3.35rem);
    line-height:1.06;
    letter-spacing:-0.012em;
    color:var(--ink);
    margin:0 0 30px;
    padding-left:20px;
    border-left:3px solid var(--ink);
  }
  .prose p{ margin:0 0 1.15em; }
  .prose h2{
    font-family:"Inter", sans-serif;
    font-weight:500;
    font-size:1rem;
    color:var(--ink);
    margin:1.9em 0 .7em;
  }
  .prose ul{ margin:.4em 0 1.2em; padding-left:1.35em; }
  .prose li{ margin:.42em 0; }
  .prose li::marker{ color:var(--ink); }
  .prose a{ color:var(--blue); }

  .scan{ position:sticky; top:92px; }
  .scan__meta{
    display:flex; align-items:center; justify-content:space-between;
    margin:0 2px 10px;
  }
  .scan__page{ font-size:.82rem; color:var(--muted); letter-spacing:.02em; opacity:0; transition:opacity .15s ease; }
  .scan:hover .scan__page{ opacity:1; }

  .scan__canvas{
    position:relative;
    background-color:var(--paper-2);
    background-size:21px 21px;
    background-position:14px 14px;
    border:1px solid var(--rule);
    border-radius:6px;
    box-shadow:0 1px 1px rgba(30,25,15,.03), 0 10px 26px -22px rgba(40,32,15,.22);
    overflow:visible;
  }
  .scan__canvas svg,
  .scan__canvas img{ width:100%; height:auto; display:block; }

  .scan__menu{
    position:absolute; top:10px; right:10px;
    z-index:2;
  }
  .scan__menu-btn{
    width:32px; height:32px;
    display:inline-flex; align-items:center; justify-content:center;
    border:0;
    background:transparent;
    color:var(--muted);
    border-radius:6px;
    cursor:pointer;
    opacity:0; transform:translateY(-3px);
    transition:opacity .16s ease, transform .16s ease, background .15s ease, color .15s ease;
  }
  .scan__canvas:hover .scan__menu-btn,
  .scan__menu-btn:focus-visible{ opacity:1; transform:none; }
  .scan__menu-btn:hover{ background:rgba(0,0,0,.05); color:var(--ink); }
  .scan__menu-dropdown{
    position:absolute; top:100%; right:0; margin-top:4px;
    background:var(--paper-2); border:1px solid var(--rule);
    border-radius:6px;
    box-shadow:0 4px 16px rgba(30,25,15,.1);
    min-width:140px; max-width:240px;
    display:none;
  }
  .scan__menu-dropdown.open{ display:block; }
  .scan__menu-dropdown button{
    display:flex; align-items:center; gap:8px;
    width:100%; padding:9px 14px; white-space:nowrap;
    border:0; background:transparent; color:var(--ink-soft);
    font:inherit; font-size:.85rem; cursor:pointer;
    transition:background .12s ease;
  }
  .scan__menu-dropdown button:hover{ background:rgba(0,0,0,.04); }
  .scan__menu-dropdown button svg{ flex-shrink:0; width:14px; height:14px; }
  @media (hover:none){ .scan__menu-btn{ opacity:1; transform:none; } }

  .prose pre{
    font-family:"JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;
    font-size:.8rem;
    line-height:1.32;
    white-space:pre;
    overflow-x:auto;
    tab-size:2;
    color:var(--ink);
    background:var(--paper-2);
    border:1px solid var(--rule-soft);
    border-radius:6px;
    padding:16px 18px;
    margin:1.35em 0;
  }
  .prose :not(pre) > code{
    font-family:"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace;
    font-size:.86em;
    background:color-mix(in srgb, var(--ink) 6%, transparent);
    padding:.12em .4em;
    border-radius:4px;
  }
  .prose pre code{ background:none; padding:0; font:inherit; }

  .prose table{
    display:block;
    width:100%;
    overflow-x:auto;
    border-collapse:collapse;
    font-size:.92rem;
    line-height:1.45;
    margin:1.35em 0;
  }
  .prose thead th{
    font-weight:500;
    font-size:.78rem;
    text-transform:uppercase;
    letter-spacing:.05em;
    color:var(--muted);
    text-align:left;
    white-space:nowrap;
    padding:0 14px .5em 0;
    border-bottom:1px solid var(--rule);
  }
  .prose tbody td{
    padding:.55em 14px .55em 0;
    border-bottom:1px solid var(--rule-soft);
    vertical-align:top;
  }
  .prose tbody tr:last-child td{ border-bottom:0; }
  .prose th:last-child, .prose td:last-child{ padding-right:0; }
  .prose td[align="right"], .prose th[align="right"]{ text-align:right; }
  .prose td[align="center"], .prose th[align="center"]{ text-align:center; }

  .prose .katex{ font-size:1.04em; }
  .prose .katex-display{
    margin:1.2em 0;
    padding:.15em 2px;
    overflow-x:auto;
    overflow-y:hidden;
  }

  .toast{
    position:fixed; left:50%; bottom:28px; transform:translateX(-50%) translateY(12px);
    background:var(--ink); color:#fff;
    font-size:.88rem; padding:9px 16px; border-radius:6px;
    opacity:0; pointer-events:none; transition:opacity .2s ease, transform .2s ease;
  }
  .toast.show{ opacity:1; transform:translateX(-50%) translateY(0); }

  @media (max-width:880px){
    .reader{ padding:28px 20px 90px; }
    .spread{ grid-template-columns:1fr; gap:26px; }
    .scan{ position:static; max-width:480px; }
    .title{ margin-bottom:24px; }
  }

  @media (prefers-reduced-motion:reduce){
    *{ transition:none !important; }
  }
`;
