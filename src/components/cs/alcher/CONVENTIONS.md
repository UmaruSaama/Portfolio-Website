# Building an Alcheringa '25 case-study chapter

Stack: Next.js 16 App Router, TypeScript, CSS Modules. No Tailwind, no new dependencies.
Source of truth: Figma file `dx2RVFuY0SgvG3NerPr86w` (Placement-Portfolio), frame
"Alcheringa '25 – Case study Default" (504:66680), page "Alcheringa App 25".
Content column = 1020px wide ("Content" 504:66847). The page background (pixel-art night
world, act interludes, hero) is ALREADY BUILT — you only build chapter content.

## Chapter frames (Figma node ids) and chapter ids
| id | Figma frame | node |
|---|---|---|
| snapshot | 02 · Snapshot | 504:66848 |
| context | 03 · Context | 504:66888 |
| problem | 04 · The problem | 504:66979 |
| attendees | 05 · Meet the attendees | 504:67030 |
| learned | 06 · What I learned | 504:67158 |
| changed | 07 · What changed and why | 504:67286 |
| shaping | 08 · Shaping the app | 504:67387 |
| experience | 09 · The experience | 504:67642 |
| system | 10 · The system underneath | 504:68574 |
| next | 11 · What's next | 504:68826 |
| reflection | 12 · Reflection | 504:68856 |
| close | 13 · Close | 504:68869 |

## Where things go
- One file per chapter: `src/components/cs/alcher/Ch<NN><Name>.tsx` + `.module.css`
  (e.g. `Ch02Snapshot.tsx`). Export a no-props component, e.g. `export function Ch02Snapshot()`.
- Register it in YOUR copy's `src/components/cs/alcher/index.ts`:
  `export const alcherChapters = { snapshot: Ch02Snapshot, ... }`. The lead merges later.
- Raster images (app screens, sketches, wireframes, portraits, photos) go in
  `public/cs/alcheringa-25/img/<chapter-id>-<name>.png|webp` and are used with a plain
  `<img src="/cs/alcheringa-25/img/..." alt="..." loading="lazy" decoding="async" width height>`
  (NOT next/image; add `{/* eslint-disable-next-line @next/next/no-img-element */}` above it).
  Real alt text for meaningful images, alt="" for decorative. Convert big PNGs to webp
  (python3 PIL, quality 90; keep pixel art lossless PNG — pixel art must stay crisp).

## Shared pieces (use them; don't re-implement)
- `../Primitives`: `Chapter` (wrap the whole chapter: `<Chapter id="snapshot" label="Snapshot">`,
  gives the 96px block gap), `ChapterEnd` (pink bar + bridge line; Figma "Chapter end").
- `./Story`: `Opener` (Figma chapter opener: divider · eyebrow with cream pixel square · H1 760
  wide Hanken Medium 40/118% · optional intro row: `introTitle` at x0, `intro` body at x520),
  `Eyebrow`.
- `./Pixel`:
  - `PixelBox` — the Figma "Border" frame (bevelled pixel panel with stepped corners, rings,
    highlight, shadow). EVERY Figma frame that contains a child frame named "Border" = a
    PixelBox. Tones (match the Border's ring colours):
    `blue` (ring #065ab5/#29adff, fill #1d2b53), `pink` (#be1250/#ff77a8, fill #7e2553),
    `dark` (figure stages: #1d2b53/#065ab5, fill #111d35), `gold` (#ffa300/#ffec27 fill #ffec27),
    `cream` (speech bubbles, fill #fff1e8). `small` = 3px cells (Figma "Persona moment" bubbles).
    The box's height INCLUDES the 4px drop shadow at the bottom, like Figma. Inner fill starts
    16px from the left/right and 12px from the top; put content with padding to match Figma
    child x/y (e.g. briefing panel text at x36 y30 → `padding: 30px 36px …`).
    Pixel geometry is in real px (4px cells) — do not scale bevels/slots with --v.
  - `Slot` — Figma "Slot" frames (inset well: fill #111d35, black top/left 4px, blue bottom/right
    4px; `edge="dim"` when the bottom/right is #1d2b53). Figma slots are drawn 4px shorter than
    their frame (e.g. 52 inside 56): use the inner height.
  - `Plate` — pink "Title plate" (64 tall) with pixel text; in Figma it overlaps the panel it
    labels by 32px (`Title plate` at y −32 of the stage). Position it the same way.
  - `PixelText` — Brick Pixel text. Brick Pixel / Game Tape aren't available on the web; the
    stand-ins are `var(--font-pixel)` (Tiny5, for Brick Pixel) and `var(--font-pixel-body)`
    (Pixelify Sans, for Game Tape / Pixelify Sans). Use Figma's sizes.
  - `PixelDivider`, `Tick` (green pixel tick 20×16).
  - Small pixel icons/shapes made of 4px rects (flags, ticks, nodes, dotted paths): inline
    `<svg shape-rendering="crispEdges">` with `<path d="M..h..v..z">` rects, or CSS boxes.
- Tokens (CSS custom properties, available inside the case study): PICO-8 palette
  `--al-black --al-navy #1d2b53 --al-night #111d35 --al-plum #7e2553 --al-silver #c2c3c7
  --al-cream #fff1e8 --al-red #ff004d --al-orange #ffa300 --al-yellow #ffec27 --al-green #00e436
  --al-blue #29adff --al-lavender #83769c --al-pink #ff77a8 --al-peach #ffccaa
  --al-blue-dark #065ab5 --al-wine #422136 --al-crimson #be1250 --al-label #8f82a4
  --al-divider #4861a6`. Text with opacity in Figma (e.g. #fff1e8 @ 0.85) → `rgb(255 241 232 / 0.85)`.
  `--v` = 1 Figma px (capped at 1px). Body font is Hanken Grotesk (already set on the page).

## Fidelity rules
- Match the Figma at 1440px (content column 1020). Use exact Figma copy (curly quotes etc.).
- Everything that is text or shapes is real HTML/CSS (panels, slots, tables, timelines,
  charts, diagrams, IA trees, MoSCoW boards, palettes, type specimens). Images only for real
  imagery: app screens (pixel-art UI renders), hand sketches, wireframe photos, portraits.
  If a whole complex illustration has no reasonable HTML form, a render is acceptable — say so
  in your report.
- Fluid between 1024px and 1920px viewports: flex/grid with % or fr widths inside the 1020
  column; gaps/paddings in `calc(N * var(--v))` for layout spacing; type in px (Figma sizes);
  pixel bevel geometry in px. Nothing may overflow horizontally at 1024–1920. Phone layout not
  required.
- Vertical rhythm: chapter blocks 96px apart (Chapter does this). Keep Figma's inner spacing.
  Keep the chapter's total height within ~±2% of the Figma frame height at 1440.
- Semantic HTML: chapter H1 via Opener (h2 element), sections h3, cards h4; lists as ul/ol;
  tables as table. Body text contrast ≥ 4.5:1 (the Figma was audited; keep its colours).
- Interactive bits (only where the Figma has a prototype, e.g. ch09 annotations toggles and
  scrolling phone screens): client component (`"use client"`), keyboard accessible, real
  buttons with aria-pressed, respects prefers-reduced-motion.

## Figma MCP usage (rate-limited — be economical)
- Load tools: ToolSearch `select:mcp__Figma__use_figma,mcp__Figma__get_screenshot`.
- Pass `sessionId: "e5db2a00-5c39-4f04-9e2b-c8f4ff0e0bbc"` and fileKey on every call.
- Structure + styles: one `use_figma` call per chapter that walks the tree and returns a
  compact dump (id, type, name, x,y,w,h, layout, fills as hex@opacity, strokes, text with font
  family/style/size/lineHeight/letterSpacing/textCase and characters). Skip descending into
  frames named "Border" (they're PixelBox). Returns are capped at 48KB — split by subtree.
  Don't call get_metadata / get_design_context on big frames.
- Visual check / rasters: `get_screenshot` with `enableBase64Response: true`,
  `maxDimension` ≈ 2× what you need, `contentsOnly: true` for isolated nodes. The result prints
  `[Image source: /tmp/claude-tool-results/...png]`; `cp` it into public/. Renders are 1×
  unless you raise maxDimension above the node size (request 2× for app screens and sketches,
  e.g. maxDimension = 2 × node height, and save at that resolution).
- If you hit a rate-limit error, `sleep 60` and retry (up to 5 times). Calls sequential.
- NEVER modify the Figma file.

## Checking your work
- Your copy is a full project. `npx tsc --noEmit && npx eslint src --quiet` must pass.
- Build: `npx next build --webpack` (plain `npm run build` fails in copies because
  node_modules is a symlink). Serve: `npx next start -p <your port>` in the background.
- Screenshot `http://localhost:<port>/work/alcheringa-25` with Playwright
  (`require('playwright')`, `chromium.launch()` needs no options) at 1440×900 and 1024×800,
  scroll to `#chapter-<id>`, compare with a Figma screenshot of the same chapter frame. Fix
  differences. Measure your chapter's height (`getBoundingClientRect().height`) vs Figma.
- Only touch your chapter files, your index.ts lines, and your images. Don't commit. Don't
  edit shared files (Pixel*, Story*, Primitives*, theme); if a shared piece is missing
  something, implement it locally in your chapter and mention it in your report.

## Report back (short)
Files created, images added (sizes), chapter heights vs Figma at 1440, any deviations or
things you couldn't match, anything the lead must merge (index.ts lines).
