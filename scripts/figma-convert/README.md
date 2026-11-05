# Figma → case-study chapters

`convert.py` turns a Figma `get_design_context` export (React + Tailwind, forceCode)
of a whole case-study frame into one TSX file of chapter components plus a scoped
`tokens.css` (Tailwind class names compiled to plain CSS, px → `calc(N * var(--v))`).

```
python3 convert.py <raw.tsx> <slug> <outdir> <config.json>
```

`ccd.json` is the CCD Placements v4 config (frame 834:33508): raster screens, colour
fields and lines drawn in CSS, chapter ids, and site-only edits (`drop`, `addClass`,
`tagAs`, `replace`). Copy `<outdir>/Chapters.tsx` and `tokens.css` into
`src/components/cs/<slug>/`. Hand-written rules live in `ccd.css` next to them.
