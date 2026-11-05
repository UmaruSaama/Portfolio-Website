"""Figma get_design_context (React + Tailwind) -> site chapters (TSX + scoped CSS).

usage: python3 convert.py <raw.tsx> <slug> <outdir> <chapter-id-map.json>
Writes <outdir>/Chapters.tsx and <outdir>/case.css. Everything is scoped
under .cs-<slug>; px lengths become calc(N * var(--v)) so the 1440 frame
scales as one piece; a compact layer (< 1024px) stacks wide rows and
scales absolute-positioned figures to fit.
"""
import json, re, sys
from parse import parse

raw, slug, outdir, idmap_path = sys.argv[1:5]
cfg = json.load(open(idmap_path))
code = open(raw).read()
ROOT = f"cs-{slug}"
consts = dict(re.findall(r'^const (\w+) = "([^"]+)";', code, re.M))
order = parse(code)

RASTER = re.compile(cfg["raster"])
ASSET_DIR = cfg["assetDir"]
RASTER_DIR = cfg["rasterDir"]
FIELDS = cfg.get("fields", {})        # imgName -> [hex, opacity, blur, size]
LINES = cfg.get("lines", {})          # imgName -> css background
SVG_ASSETS = set(cfg.get("svgAssets", []))
SKIP_ASSETS = set(cfg.get("skipAssets", []))
DROP = set(cfg.get("drop", []))            # node ids removed from the site
ADD_CLASS = cfg.get("addClass", {})        # node id -> extra classes
TAG_AS = cfg.get("tagAs", {})              # node id -> [tag, extra attrs]
REPLACE = cfg.get("replace", [])           # [old, new] on the generated TSX

# ---------------------------------------------------------------- tokens -> css
def v(x):
    """px -> scaled length; leaves %, numbers, keywords alone."""
    def rep(m):
        n = float(m.group(1))
        if n == 0:
            return "0"
        s = ("%g" % n)
        return f"calc({s} * var(--v))"
    return re.sub(r"(-?\d*\.?\d+)px", rep, x)

def br(tok, pre):
    return tok[len(pre) + 2:-1].replace("_", " ") if tok.startswith(pre + "-[") else None

FONTS = {
    "SF Pro": "var(--cs-sans)",
    "SF Pro Text": "var(--cs-sans)",
    "SF Pro Display": "var(--cs-sans)",
    "Nunito Sans": '"Nunito Sans", var(--cs-sans)',
    "Noto Sans": '"Noto Sans", var(--cs-sans)',
    "Noto Sans JP": '"Noto Sans JP", var(--cs-sans)',
    "Inter": "var(--cs-sans)",
}
SPACING = lambda n: f"calc({float(n) * 4:g} * var(--v))" if float(n) else "0"
ALIGN = {"start": "flex-start", "center": "center", "end": "flex-end", "baseline": "baseline", "stretch": "stretch"}
JUST = {"between": "space-between", "center": "center", "end": "flex-end", "start": "flex-start"}
unknown = set()

def css_for(t):
    simple = {
        "flex": "display:flex", "flex-col": "flex-direction:column", "flex-row": "flex-direction:row",
        "flex-wrap": "flex-wrap:wrap", "inline-grid": "display:inline-grid", "grid": "display:grid",
        "block": "display:block", "contents": "display:contents", "hidden": "display:none",
        "relative": "position:relative", "absolute": "position:absolute",
        "content-stretch": "align-content:stretch", "content-start": "align-content:flex-start",
        "content-center": "align-content:center", "place-items-start": "place-items:start",
        "self-stretch": "align-self:stretch", "shrink-0": "flex-shrink:0", "grow": "flex-grow:1",
        "size-full": "width:100%;height:100%", "w-full": "width:100%", "h-full": "height:100%",
        "w-px": "width:1px", "h-px": "height:1px", "min-w-px": "min-width:1px", "min-h-px": "min-height:1px",
        "min-w-full": "min-width:100%", "max-w-none": "max-width:none",
        "overflow-clip": "overflow:clip", "overflow-hidden": "overflow:hidden",
        "uppercase": "text-transform:uppercase", "whitespace-nowrap": "white-space:nowrap",
        "whitespace-pre": "white-space:pre", "whitespace-pre-wrap": "white-space:pre-wrap",
        "text-center": "text-align:center", "text-left": "text-align:left", "text-right": "text-align:right",
        "text-ellipsis": "text-overflow:ellipsis", "text-white": "color:#fff", "bg-white": "background-color:#fff",
        "border": "border-width:1px", "border-t": "border-top-width:1px", "border-b": "border-bottom-width:1px",
        "border-l": "border-left-width:1px", "border-r": "border-right-width:1px",
        "border-solid": "border-style:solid", "border-dashed": "border-style:dashed",
        "cursor-pointer": "cursor:pointer", "font-bold": "font-weight:700", "font-semibold": "font-weight:600",
        "font-medium": "font-weight:500", "font-normal": "font-weight:400", "italic": "font-style:italic",
        "-translate-x-1/2": "translate:-50% 0", "-translate-y-1/2": "translate:0 -50%",
        "left-1/2": "left:50%", "top-1/2": "top:50%", "bg-gradient-to-r": "", "bg-gradient-to-b": "",
        "underline": "text-decoration-line:underline", "line-through": "text-decoration-line:line-through",
        "pointer-events-none": "pointer-events:none", "object-cover": "object-fit:cover",
        "object-contain": "object-fit:contain", "rounded-full": "border-radius:9999px",
    }
    if t in simple:
        return simple[t]
    m = re.fullmatch(r"items-(\w+)", t)
    if m: return f"align-items:{ALIGN.get(m.group(1), m.group(1))}"
    m = re.fullmatch(r"justify-(\w+)", t)
    if m: return f"justify-content:{JUST.get(m.group(1), m.group(1))}"
    m = re.fullmatch(r"(-?)(inset|left|right|top|bottom|h|w|mt|mb|ml|mr|p|px|py|pt|pb|pl|pr)-(\d+(?:\.\d+)?)", t)
    if m:
        neg, k, n = m.groups(); val = SPACING(n)
        if neg: val = f"calc(-1 * {val})"
        return {"inset": f"inset:{val}", "left": f"left:{val}", "right": f"right:{val}", "top": f"top:{val}",
                "bottom": f"bottom:{val}", "h": f"height:{val}", "w": f"width:{val}", "mt": f"margin-top:{val}",
                "mb": f"margin-bottom:{val}", "ml": f"margin-left:{val}", "mr": f"margin-right:{val}",
                "p": f"padding:{val}", "px": f"padding-left:{val};padding-right:{val}",
                "py": f"padding-top:{val};padding-bottom:{val}", "pt": f"padding-top:{val}",
                "pb": f"padding-bottom:{val}", "pl": f"padding-left:{val}", "pr": f"padding-right:{val}"}[k]
    m = re.fullmatch(r"(col|row)-(\d+)", t)
    if m: return f"grid-{'column' if m.group(1)=='col' else 'row'}:{m.group(2)}"
    m = re.fullmatch(r"opacity-(\d+)", t)
    if m: return f"opacity:{int(m.group(1))/100:g}"
    m = re.fullmatch(r"shrink-(\d+)", t)
    if m: return f"flex-shrink:{m.group(1)}"
    m = re.fullmatch(r"border-(\d+)", t)
    if m: return f"border-width:{m.group(1)}px"
    m = re.fullmatch(r"\[([a-z-]+):(.+)\]", t)
    if m: return f"{m.group(1)}:{m.group(2).replace('_', ' ')}"
    m = re.fullmatch(r"font-\['(.+?)(?::(.+))?'\]", t)
    if m:
        fam = m.group(1).replace("_", " "); sty = (m.group(2) or "").replace("_", " ")
        out = f"font-family:{FONTS.get(fam, repr(fam).replace(chr(39), chr(34)) + ', var(--cs-sans)')}"
        if "Italic" in sty: out += ";font-style:italic"
        return out
    # bracketed families
    for pre, prop, scale in [
        ("gap", "gap", True), ("gap-x", "column-gap", True), ("gap-y", "row-gap", True),
        ("p", "padding", True), ("px", "padding-inline", True), ("py", "padding-block", True),
        ("pt", "padding-top", True), ("pb", "padding-bottom", True), ("pl", "padding-left", True), ("pr", "padding-right", True),
        ("w", "width", True), ("h", "height", True), ("min-w", "min-width", True), ("min-h", "min-height", True),
        ("max-w", "max-width", True), ("max-h", "max-height", True),
        ("left", "left", True), ("right", "right", True), ("top", "top", True), ("bottom", "bottom", True),
        ("inset", "inset", True), ("rounded", "border-radius", True),
        ("rounded-tl", "border-top-left-radius", True), ("rounded-tr", "border-top-right-radius", True),
        ("rounded-bl", "border-bottom-left-radius", True), ("rounded-br", "border-bottom-right-radius", True),
        ("leading", "line-height", True), ("tracking", "letter-spacing", True),
        ("blur", "filter", False), ("backdrop-blur", "backdrop-filter", False),
        ("shadow", "box-shadow", True), ("drop-shadow", "filter", False),
        ("grid-cols", "grid-template-columns", True), ("grid-rows", "grid-template-rows", True),
        ("flex", "flex", False), ("opacity", "opacity", False), ("basis", "flex-basis", True),
        ("size", None, True), ("translate-x", None, True), ("translate-y", None, True),
        ("rotate", "rotate", False), ("z", "z-index", False), ("mt", "margin-top", True),
        ("aspect", "aspect-ratio", False),
    ]:
        val = br(t, pre)
        if val is None:
            continue
        if scale: val = v(val)
        if pre == "size": return f"width:{val};height:{val}"
        if pre == "blur": return f"filter:blur({val})"
        if pre == "backdrop-blur": return f"backdrop-filter:blur({val});-webkit-backdrop-filter:blur({val})"
        if pre == "drop-shadow":
            parts = re.split(r",(?![^()]*\))", val)
            return "filter:" + " ".join(f"drop-shadow({p.strip()})" for p in parts)
        if pre == "translate-x": return f"translate:{val} 0"
        if pre == "translate-y": return f"translate:0 {val}"
        if pre == "flex": return "flex:" + " ".join(p if not re.fullmatch(r"\d+", p) or i < 2 else p + "px" for i, p in enumerate(val.split()))
        return f"{prop}:{val}"
    for pre in ("bg", "text", "border", "border-t", "border-b", "border-l", "border-r", "from", "via", "to", "font"):
        val = br(t, pre)
        if val is None:
            continue
        isLen = re.fullmatch(r"-?\d*\.?\d+(px)?", val)
        if pre == "bg": return f"background-color:{val}" if not val.startswith("url") else f"background-image:{val}"
        if pre == "text": return f"font-size:{v(val)}" if isLen else f"color:{val}"
        if pre == "font": return f"font-weight:{val}"
        if pre.startswith("border"):
            side = {"border": "", "border-t": "-top", "border-b": "-bottom", "border-l": "-left", "border-r": "-right"}[pre]
            return f"border{side}-width:{val}" if isLen else f"border{side}-color:{val}"
        return ""  # gradient stops handled inline
    unknown.add(t)
    return ""

def esc(t):
    return re.sub(r"([^A-Za-z0-9_-])", r"\\\1", t)

# ---------------------------------------------------------------- jsx rewriting
def in_raster(n):
    p = n["parent"]
    while p:
        if RASTER.match(p["name"]): return True
        p = p["parent"]
    return False

def cls_of(n):
    m = re.search(r'className="([^"]*)"', n["attrs"])
    return m.group(1) if m else ""

def width_of(n):
    m = re.search(r"(?:^| )w-\[(\d+(?:\.\d+)?)px\]", cls_of(n))
    return float(m.group(1)) if m else None

children = {}
for n in order:
    children.setdefault(id(n["parent"]) if n["parent"] else None, []).append(n)
def kids(n): return children.get(id(n), [])

edits = []  # (start, end, text) applied right-to-left within a chapter
extra_cls = {}  # node start -> extra classes
extra_style = {}

for n in order:
    if n["id"] in DROP:
        edits.append((n["start"], n["end"], ""))
        continue
    if n["id"] in TAG_AS:
        tag, attrs = TAG_AS[n["id"]]
        open_tag = code[n["start"]:n["tagend"]]
        close_at = code.rfind("</div>", n["start"], n["end"])
        new_open = open_tag.replace("<div", f"<{tag} {attrs}", 1)
        if n["id"] in ADD_CLASS:
            new_open = re.sub(r'className="([^"]*)"', lambda m: f'className="{m.group(1)} {ADD_CLASS[n["id"]]}"', new_open, count=1)
        inner_edits = []
        edits.append((n["start"], n["tagend"], new_open))
        edits.append((close_at, close_at + 6, f"</{tag}>"))
    elif n["id"] in ADD_CLASS:
        extra_cls[n["start"]] = extra_cls.get(n["start"], "") + " " + ADD_CLASS[n["id"]]
    if n["name"] and RASTER.match(n["name"]) and not in_raster(n):
        nid = n["id"].replace(":", "-")
        alt = n["name"].split(" · ", 1)[-1] if " · " in n["name"] else n["name"]
        kind = "phone" if n["name"].startswith("Phone") else "browser"
        edits.append((n["start"], n["end"],
            f'<img src="{RASTER_DIR}/{nid}.webp" alt="{alt} screen" className="{cls_of(n)} cs-raster cs-raster-{kind}" loading="lazy" decoding="async" />'))
        continue
    if in_raster(n):
        continue
    c = cls_of(n)
    if n["src"]:
        name = n["src"]
        if name in FIELDS:
            hexc, op, blur, size = FIELDS[name]
            wrap = n["parent"]
            edits.append((wrap["start"], wrap["end"],
                f'<span className="cs-field" style={{{{ background: "{hexc}", opacity: {op}, filter: "blur(calc({blur / 2:g} * var(--v)))" }}}} />'))
        elif name in LINES:
            edits.append((n["start"], n["end"], f'<span className="cs-line" style={{{{ background: "{LINES[name]}" }}}} />'))
        elif name in SKIP_ASSETS:
            edits.append((n["start"], n["end"], ""))
        else:
            ext = "svg" if name in SVG_ASSETS else "png"
            new = re.sub(r"src=\{\w+\}", f'src="{ASSET_DIR}/{name}.{ext}"', code[n["start"]:n["tagend"]])
            edits.append((n["start"], n["tagend"], new))
        continue
    if n["tag"] == "div" and "flex" in c.split() and "flex-col" not in c.split():
        ks = [k for k in kids(n) if "absolute" not in cls_of(k).split()]
        tot = sum((width_of(k) or 0) for k in ks)
        big = max([width_of(k) or 0 for k in ks] or [0])
        if len(ks) >= 2 and (tot > 560 or big >= 400):
            extra_cls[n["start"]] = extra_cls.get(n["start"], "") + " cs-stack"
    abs_kids = [k for k in kids(n) if "absolute" in cls_of(k).split()]
    w = width_of(n)
    if abs_kids and w and 360 <= w <= 1100 and len(abs_kids) >= 3:
        extra_cls[n["start"]] = extra_cls.get(n["start"], "") + " cs-scale"
        extra_style[n["start"]] = f'"--cs-w": {w:g}'
    if "bg-gradient-to-r" in c.split() or "bg-gradient-to-b" in c.split():
        stops = re.findall(r"(from|via|to)-\[([^\]]+)\]", c)
        d = "to right" if "bg-gradient-to-r" in c else "to bottom"
        g = ", ".join(s.replace("_", " ") for _, s in stops)
        extra_style[n["start"]] = (extra_style.get(n["start"], "") + (", " if n["start"] in extra_style else "")) + f'backgroundImage: "linear-gradient({d}, {g})"'

# ---------------------------------------------------------------- chapters
root = order[0]
chapters = [k for k in kids(root)]
tsx = ['/* Generated by convert.py from the Figma frame; edit the Figma, then regenerate. */\n/* eslint-disable @next/next/no-img-element -- plain static assets, sized by the frame */',
       'import type { ComponentType } from "react";', '']
comps = {}
alltok = set()
for ch in chapters:
    cid = cfg["chapters"].get(ch["id"])
    if not cid:
        continue
    s, e = ch["start"], ch["end"]
    local = sorted([x for x in edits if s <= x[0] and x[1] <= e], key=lambda x: -x[0])
    # drop nested edits (an outer edit already covers them)
    kept = []
    for x in local:
        if any(o[0] <= x[0] and x[1] <= o[1] and o is not x for o in local if o != x and (o[1] - o[0]) > (x[1] - x[0])):
            continue
        kept.append(x)
    text = code
    # apply class/style extras by position first (they don't change lengths of earlier text)
    marks = sorted([p for p in set(list(extra_cls) + list(extra_style)) if s <= p < e], reverse=True)
    pieces = text[s:e]
    def apply(pieces, base):
        res = pieces
        ops = []
        for x in kept:
            ops.append(("edit", x[0], x))
        for p in marks:
            ops.append(("mark", p, None))
        for kind, pos, x in sorted(ops, key=lambda o: -o[1]):
            rel = pos - base
            if kind == "edit":
                res = res[:rel] + x[2] + res[x[1] - base:]
            else:
                # inside raster? skip if within a kept edit range
                if any(k[0] <= pos < k[1] for k in kept):
                    continue
                tag_end = res.find(">", rel)
                head = res[rel:tag_end]
                if p_c := extra_cls.get(pos):
                    head = re.sub(r'className="([^"]*)"', lambda m: f'className="{m.group(1)}{p_c}"', head, count=1)
                if p_s := extra_style.get(pos):
                    head = head.replace(" className=", f" style={{{{ {p_s} }}}} className=", 1)
                res = res[:rel] + head + res[tag_end:]
        return res
    body = apply(pieces, s)
    body = re.sub(r' data-node-id="[^"]*"', "", body)
    body = re.sub(r' data-name="[^"]*"', "", body)
    body = re.sub(r" style=\{\{ fontVariationSettings: '\"wdth\" 100' \}\}", "", body)
    body = re.sub(r"style=\{\{ (\"--cs-w\": [\d.]+) \}\}", lambda m: f"style={{{{ {m.group(1)} }} as CSSProperties}}", body)
    # root div -> section with anchor
    body = re.sub(r'^<div className="', f'<section id="chapter-{cid}" aria-label="{cfg["labels"][cid]}" className="cs-ch ', body, count=1)
    body = body[: body.rfind("</div>")] + "</section>"
    # headings: 48px statements -> h2, 28px block heads -> h3
    body = re.sub(r'<p className="([^"]*text-\[(?:48|56|64|72|80)px\][^"]*)"([^>]*)>(.*?)</p>', r'<h2 className="\1 cs-h"\2>\3</h2>', body, flags=re.S)
    body = re.sub(r'<p className="([^"]*text-\[(?:28|30)px\][^"]*)"([^>]*)>(.*?)</p>', r'<h3 className="\1"\2>\3</h3>', body, flags=re.S)
    for m in re.finditer(r'className="([^"]*)"', body):
        alltok.update(m.group(1).split())
    for old, new in REPLACE:
        body = body.replace(old, new)
    name = "Ch_" + re.sub(r"\W", "_", cid)
    comps[cid] = name
    tsx.append(f"export function {name}() {{\n  return (\n{body}\n  );\n}}\n")

tsx[1] = 'import type { ComponentType, CSSProperties } from "react";'
if any("<Link " in t for t in tsx):
    tsx.insert(3, 'import Link from "next/link";')
tsx.append("export const chapters: Record<string, ComponentType> = {")
for cid, name in comps.items():
    tsx.append(f'  "{cid}": {name},')
tsx.append("};\n")
open(f"{outdir}/Chapters.tsx", "w").write("\n".join(tsx))

rules = []
for t in sorted(alltok):
    if t.startswith("cs-"):
        continue
    css = css_for(t)
    if css:
        rules.append(f".{ROOT} .{esc(t)}{{{css}}}")
# compact (< 1024px): readable type floors, except inside scaled figures
comp = []
for t in sorted(alltok):
    m = re.fullmatch(r"text-\[(\d+(?:\.\d+)?)px\]", t)
    if m:
        n = float(m.group(1))
        floor = min(n, round(12 + (n - 12) * 0.45, 1)) if n > 12 else n * 0.9
        comp.append(f".{ROOT} .{esc(t)}{{font-size:max(calc({n:g} * var(--v)), {floor:g}px)}}")
        comp.append(f".{ROOT} :is(.cs-scale, .cs-wide) .{esc(t)}{{font-size:calc({n:g} * var(--v))}}")
rules.append("@media (max-width: 1023px) {\n" + "\n".join(comp) + "\n}")
open(f"{outdir}/tokens.css", "w").write("/* Generated by convert.py. */\n" + "\n".join(rules) + "\n")
print("chapters", list(comps), "rules", len(rules), "unknown", sorted(unknown))
