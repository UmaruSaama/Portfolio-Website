/*
  Card ⇄ film match cut.

  A product film opens on its own home card, pushes into the card's iPad, and
  ends by pulling back out to the card. The site plays that camera move on the
  LIVE card (its real DOM, at whatever size the card is) in lock-step with the
  film's clock, and dissolves to/from the film only while the frame is nothing
  but the iPad screen, where live card and film are the same picture. So the
  hand-off is invisible at every card width, not just the width the film was
  rendered at.

  Numbers come from the film source (card-videos/film4.js). Film space is the
  1920 × 1150 frame; a camera {L, T, W} shows the film-space rectangle at
  (L, T), W wide, full frame.
*/

export type Cam = { L: number; T: number; W: number };

export type FilmMatch = {
  /** Frame rate of the film. */
  fps: number;
  /** The iPad screen (the poster's box) in film space. */
  screen: { x: number; y: number; w: number };
  /**
   * Sharp copy of what the screen shows, laid over the live iPad during the
   * push (as the film does): the poster in the card is small and clipped by
   * the card's edge, the plate is neither. In screen-image px: `pad` from the
   * poster's top, `w` × `h`.
   */
  plate: { src: string; w: number; h: number; pad: number; posterW: number; fade: [number, number] };
  open: {
    /** Push from the card into the screen: start, end (s) and the framing it lands on. */
    from: number;
    to: number;
    land: Cam;
    /** Player dissolves in over this window: the frame is all screen and the
     *  camera is nearly still, so live card and film agree to the pixel. */
    reveal: [number, number];
  };
  end: {
    /** Pull back out of the screen: start, end (s); starts as `scale` around (cx, cy). */
    from: number;
    to: number;
    scale: number;
    cx: number;
    cy: number;
    /** Player dissolves out over this window (the film holds still on the
     *  iPad before `from`); the live card then makes the whole pull. */
    release: [number, number];
  };
};

const FW = 1920;
const FH = 1150;
const K0: Cam = { L: 0, T: 0, W: FW };

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** The film's E.io (cubic in-out) and its perceptually even zoom. */
const io = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (t: number) => t * t * (3 - 2 * t);
const seg = (t: number, a: number, b: number, e = io) => e(clamp01((t - a) / (b - a)));
const zexp = (a: number, b: number, p: number) => a * Math.pow(b / a, p);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const lerpK = (a: Cam, b: Cam, p: number): Cam => ({ L: lerp(a.L, b.L, p), T: lerp(a.T, b.T, p), W: zexp(a.W, b.W, p) });
const camAround = (s: number, cx: number, cy: number): Cam => ({ L: cx - FW / 2 / s, T: cy - FH / 2 / s, W: FW / s });
/** The live card takes the film's end framing from here (a hair before the release). */
const endStart = (m: FilmMatch) => Math.min(m.end.from, m.end.release[0]) - 0.05;

/** Card aspect the film was framed for; other shapes (compact cards) get a plain dissolve. */
export const fitsFilm = (cardW: number, cardH: number) => Math.abs(cardH / cardW - FH / FW) < 0.012;

/**
 * The live card expressed as a film camera: the framing that makes the
 * anchored mapping the identity. `scr` is the live screen box in card px.
 */
export function liveIdentity(m: FilmMatch, scr: { x: number; y: number; w: number }, cardW: number): Cam {
  const k = m.screen.w / scr.w; // film px per live px
  return { L: m.screen.x - scr.x * k, T: m.screen.y - scr.y * k, W: cardW * k };
}

/**
 * Live-card framing at film time t, or null when the live card should sit
 * untouched (the middle of the film, under the opaque player).
 */
export function liveCam(m: FilmMatch, t: number, id: Cam): Cam | null {
  const { open, end } = m;
  if (t < open.reveal[1]) {
    const p = seg(t, open.from, open.to);
    // Two cameras with the film's easing: one from the live card, one from the
    // film's card. Blend to the film's before the reveal, so the dissolve
    // happens between identical frames.
    const fromLive = lerpK(id, open.land, p);
    const filmCam = lerpK(K0, open.land, p);
    return lerpK(fromLive, filmCam, smooth(clamp01((t - open.from - 1.0) / (open.reveal[0] - open.from - 1.0))));
  }
  if (t < endStart(m)) return null;
  const k = seg(t, end.from, end.to);
  const filmCam = camAround(zexp(end.scale, 1, k), lerp(end.cx, FW / 2, k), lerp(end.cy, FH / 2, k));
  const toLive = lerpK(camAround(end.scale, end.cx, end.cy), id, k);
  // Film's own path through the release, then ease onto the live card's rest.
  return lerpK(filmCam, toLive, smooth(clamp01((t - end.release[1]) / (end.to - 0.25 - end.release[1]))));
}

/** Player opacity at film time t (match mode). */
export function playerAlpha(m: FilmMatch, t: number) {
  const a = clamp01((t - m.open.reveal[0]) / (m.open.reveal[1] - m.open.reveal[0]));
  const b = 1 - clamp01((t - m.end.release[0]) / (m.end.release[1] - m.end.release[0]));
  return Math.min(a, b);
}

/**
 * Plate opacity. Opening: in as the push goes deep, gone once the film has
 * taken over. Closing: on under the film before the release (it covers the
 * live iPad wherever this card size clips it), out as the camera settles home.
 */
export function plateAlpha(m: FilmMatch, t: number) {
  if (t < m.open.reveal[1]) return seg(t, m.plate.fade[0], m.plate.fade[1]);
  if (t < endStart(m)) return 0;
  return 1 - seg(t, m.end.to - 0.7, m.end.to);
}

/** Card chrome outside the slide (glow, top line) leaves with the push and comes back with the pull. */
export function chromeAlpha(m: FilmMatch, t: number) {
  if (t < endStart(m)) return 1 - clamp01((t - m.open.from) / 0.8);
  return clamp01((t - (m.end.to - 0.6)) / 0.6);
}

/** CSS matrix that shows the live card through camera `c` (origin: card top-left). */
export function liveMatrix(m: FilmMatch, c: Cam, scr: { x: number; y: number; w: number }, cardW: number) {
  const k = m.screen.w / scr.w;
  const a = (k * cardW) / c.W;
  const bx = ((m.screen.x - scr.x * k - c.L) * cardW) / c.W;
  const by = ((m.screen.y - scr.y * k - c.T) * cardW) / c.W;
  return { a, bx, by };
}
