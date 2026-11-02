# Building a case-study chapter (ImmerLingo)

Stack: Next.js 16 App Router, TypeScript, CSS Modules. No Tailwind, no new dependencies.
Source of truth: Figma file `dx2RVFuY0SgvG3NerPr86w` (Placement-Portfolio), frame
"ImmerLingo – Case study D" (153:5016). Content column = 1020px wide.

## Where things go
- One file per chapter: `src/components/cs/immerlingo/Ch<NN><Name>.tsx` + `Ch<NN><Name>.module.css`.
- Export a component with no props, e.g. `export function Ch02Snapshot() { ... }`.
- Register it in YOUR copy's `src/components/cs/immerlingo/index.ts` (so you can see it):
  `{ snapshot: Ch02Snapshot, ... }`. The lead merges registrations later. Chapter ids: intro, snapshot, problem, learners, learned, principles, loop, experience,
  system, next, reflection, close.
- Raster images (photos, sketches, wireframes, avatars, app screenshots) go in
  `public/cs/immerlingo/img/<chapter-id>-<name>.png` and are used with a plain
  `<img src="/cs/immerlingo/img/..." alt="..." loading="lazy" decoding="async">`
  (NOT next/image). Give every meaningful image real alt text; decorative ones alt="".

## Use the shared pieces (src/components/cs/)
- `Primitives.tsx`: `Chapter` (wrap the whole chapter: `<Chapter id="snapshot" label="Snapshot">`),
  `Opener` (eyebrow + H1 statement + optional intro row), `Eyebrow`, `SectionHead`,
  `ChapterEnd` (pink bar bridge line), `Figure` (toolbar with type tag + title over a stage),
  `Fact`, `Quote`.
- `cs.module.css`: type classes `eyebrow label h1 h2 h3 body small strong accent`, surfaces
  `panel card cardSmall`. Import as `import cs from "../cs.module.css";`.
- CSS custom properties available everywhere inside the case study: `--v` (1 Figma px,
  capped at 1px), `--cs-text-primary|secondary|tertiary`, `--cs-white-04/08/10/14/40/70/80/86`,
  `--cs-surface-04/06/08/10/12/14/24`, `--cs-pink`, `--cs-pink-14/28`, `--cs-mint`,
  `--cs-mint-28`, `--cs-yellow`, `--cs-yellow-28`. Font is Hanken Grotesk (already set).
  Map Figma variables to these (Figma "white/08" = rgba(255,255,255,.08); its fallback in
  generated code says rgba(0,0,0,.08) — that fallback is wrong, use white).

## Fidelity rules
- Match the Figma closely at 1440px wide (that's the frame width; content column 1020).
- Everything that is text or shapes is real HTML/CSS (cards, tables, charts, bars, matrices,
  diagrams, journey maps). Images only for real imagery. Inline SVG is fine for icons/lines.
- Fluid, not fixed: use flex/grid and % widths inside the 1020 column; gaps/paddings in
  `calc(N * var(--v))`; type in px from cs.module.css. Nothing may overflow horizontally
  between 1024px and 1920px viewport widths. (Phone layout is NOT required now.)
- Vertical rhythm: blocks inside a chapter are 96px apart (the `Chapter` component already
  applies `gap: calc(96 * var(--v))`); keep Figma's inner spacing.
- Figure stages: keep the Figma stage height as `min-height: calc(<h> * var(--v))`.
- Semantic HTML: headings in order (chapter title is h2, sections h3, cards h4), lists as
  `ul/ol`, tables as `table`. Text contrast ≥ 4.5:1 for body copy.
- Copy: use the exact Figma text. Don't invent or rewrite content.

## Figma MCP usage (IMPORTANT: rate-limited)
- The Figma MCP has a tool-call limit ("You've reached the Figma MCP tool call limit on the
  Education plan"). Keep calls minimal and sequential (one at a time). If you get that error,
  wait 60 s (`sleep 60` in Bash) and retry, up to 5 times.
- Node structure (ids, names, sizes) is already dumped in `/tmp/cs_meta.xml` (XML, one node
  per line, text node names = their text). Read it with grep/python instead of calling
  get_metadata.
- Load tools with ToolSearch: `select:mcp__Figma__get_design_context,mcp__Figma__get_screenshot`.
- `get_design_context` (fileKey dx2RVFuY0SgvG3NerPr86w, nodeId, excludeScreenshot: true when you
  already have a screenshot) gives exact styles/text; treat its React+Tailwind output as a
  reference only. Asset URLs in it (figma.com/api/mcp/asset/...) CANNOT be downloaded here.
- To get a raster image or a visual check: `get_screenshot` with enableBase64Response: true,
  contentsOnly: true, maxDimension: 2000. The result prints `[Image source: /tmp/claude-tool-results/...png]`;
  `cp` that file into public/cs/immerlingo/img/. Renders are 1× only.
- Icons from Figma: draw them as small inline SVGs, or use a screenshot of the icon node.

## Checking your work
- `cd /home/claude/site && npx tsc --noEmit && npm run lint` must pass.
- Visual check: `npm run build && npx next start -p <port>` (run it in the background) and
  screenshot `http://localhost:<port>/work/immerlingo` with Playwright (`require('playwright')`
  works; chromium.launch() needs no options) at 1440×900 and 1920×1080, scrolling to your
  chapter (`document.getElementById('chapter-<id>').scrollIntoView()`), and compare with a
  Figma screenshot of the same section. Fix differences.
- Don't touch files outside your chapters, `index.ts` registration lines for your chapters,
  and your own images. Don't commit or publish.
