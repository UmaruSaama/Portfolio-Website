// Turns the static export in out/ into one self-contained HTML file
// (artifact/index.html): CSS, fonts, images and JS chunks are all inlined,
// because the claude.ai artifact page cannot load files by absolute path.
//
// Usage: npm run build:artifact

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, cpSync, rmSync } from "node:fs";
import { join, extname } from "node:path";
import { execSync } from "node:child_process";

const OUT = "out";

// Static export first (cross-platform: no shell env syntax).
execSync("npx next build", { stdio: "inherit", env: { ...process.env, ARTIFACT: "1" } });
const DEST = "artifact";

const mime = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
};

const dataUri = (urlPath) => {
  const file = join(OUT, decodeURIComponent(urlPath.split("?")[0]));
  const type = mime[extname(file)] ?? "application/octet-stream";
  return `data:${type};base64,${readFileSync(file).toString("base64")}`;
};

let html = readFileSync(join(OUT, "index.html"), "utf8");

// 1. Stylesheets → inline <style>, with fonts as data URIs.
html = html.replace(/<link rel="stylesheet" href="([^"]+)"[^>]*\/?>/g, (_, href) => {
  const css = readFileSync(join(OUT, href), "utf8").replace(
    /url\((["']?)(?:\.\.\/media\/|\/_next\/static\/media\/)([^)"']+)\1\)/g,
    (_m, _q, name) => `url(${dataUri(`/_next/static/media/${name}`)})`,
  );
  return `<style>${css}</style>`;
});

// 2. Drop hints and tags that point at files the artifact cannot serve.
// The noModule polyfill is only for browsers without ES modules; skip it.
const skip = new Set();
html = html
  .replace(/<link rel="(?:preload|preconnect|icon)"[^>]*\/?>/g, "")
  .replace(/<script src="([^"]+)" noModule=""><\/script>/g, (_, src) => {
    skip.add(src);
    return "";
  });

// 3. Script chunks → collected, removed from the head, appended at the end of
//    <body> as inline scripts (the Turbopack runtime registers chunks through a
//    global queue, so order between chunks does not matter).
const chunks = [];
html = html.replace(/<script src="(\/_next\/static\/chunks\/[^"]+)"[^>]*><\/script>/g, (_, src) => {
  chunks.push(src);
  return "";
});
// Include every chunk, so nothing has to be fetched at runtime.
const chunkDir = join(OUT, "_next/static/chunks");
for (const f of readdirSync(chunkDir)) {
  const src = `/_next/static/chunks/${f}`;
  if (f.endsWith(".js") && !chunks.includes(src) && !skip.has(src)) chunks.push(src);
}
// Each chunk registers itself with document.currentScript.src, which an inline
// script does not have. Turbopack also accepts the chunk path as a string
// ("static/chunks/<file>"), so pass that instead; the runtime then treats the
// chunk as loaded and never fetches it.
const CURRENT_SCRIPT = '"object"==typeof document?document.currentScript:void 0';
const inlineJs = chunks
  .map((src) => {
    const path = JSON.stringify(src.replace(/^\/_next\//, ""));
    return readFileSync(join(OUT, src), "utf8")
      .split(CURRENT_SCRIPT)
      .join(path)
      .replace(/<\/script/gi, "<\\/script")
      .replace(/\uFFFD/g, "\\uFFFD"); // the artifact host rejects raw U+FFFD
  })
  .map((js) => `<script>${js}</script>`)
  .join("\n");
// Function replacer: the inlined code contains "$&"-style sequences.
html = html.replace("</body>", () => `${inlineJs}\n</body>`);

// 4. Images referenced anywhere (HTML attributes and the RSC payload).
const imageDir = join(OUT, "images");
if (existsSync(imageDir)) {
  for (const f of readdirSync(imageDir)) {
    html = html.split(`/images/${f}`).join(dataUri(`/images/${f}`));
  }
}

// 5. Self-hosted fonts (public/fonts): woff2 inlined; the .ttf fallback
//    source is dropped (the artifact can't serve it, and woff2 is enough).
html = html
  .replace(/,\s*url\((["']?)\/fonts\/[^)"']+\.ttf\1\)\s*format\((["']?)truetype\2\)/g, "")
  .replace(/url\((["']?)(\/fonts\/[^)"']+\.woff2)\1\)/g, (_, _q, path) => `url(${dataUri(path)})`);

// 6. Case-study media and card images stay as separate files of the
//    multi-file artifact (too heavy to inline). Root-relative "/cs/..." and
//    "/work/..." become relative so they resolve next to index.html.
for (const dir of ["cs", "work"]) {
  html = html.replace(new RegExp(`(["'\`(])\\/${dir}\\/`, "g"), `$1${dir}/`);
  rmSync(join(DEST, dir), { recursive: true, force: true });
  if (existsSync(join(OUT, dir))) {
    mkdirSync(DEST, { recursive: true });
    cpSync(join(OUT, dir), join(DEST, dir), { recursive: true, filter: (src) => !/\.(html|txt)$/.test(src) });
  }
}

mkdirSync(DEST, { recursive: true });
writeFileSync(join(DEST, "index.html"), html);
console.log(`${DEST}/index.html  ${(Buffer.byteLength(html) / 1024).toFixed(0)} KB, ${chunks.length} chunks inlined`);
