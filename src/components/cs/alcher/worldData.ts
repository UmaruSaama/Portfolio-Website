/* Generated from Figma World 521:53391 (Alcheringa '25 case study 504:66680, v3
 * world: skyline, festoon, crowd, stage band, mascot). Rendered 1:1, cut into
 * segments; each segment = colour stops (uniform rows, drawn as a gradient)
 * plus pieces (rows with art) stored at one pixel per 2px cell, with 1px edge
 * strips (-l / -r) that continue each row past 1440. y / h in Figma px from
 * the segment's start. Regenerate with the world pipeline; don't hand-edit. */
export type WorldPiece = { src: string; y: number; h: number };
export type WorldSegment = { h: number; pieces: WorldPiece[]; stops: [number, string][] };
export const worldData: Record<string, WorldSegment> = {
  sky: { h: 1216, pieces: [{ src: "sky-0", y: 12, h: 498 }, { src: "sky-1", y: 624, h: 36 }, { src: "sky-2", y: 744, h: 84 }], stops: [[0, "#111d35"]] },
  a1: { h: 3688, pieces: [{ src: "a1-0", y: 0, h: 72 }, { src: "a1-1", y: 172, h: 246 }], stops: [[0, "#111d35"], [18, "#151515"], [64, "#1d2b53"], [418, "#111d35"]] },
  a2: { h: 6968, pieces: [{ src: "a2-0", y: 102, h: 114 }], stops: [[0, "#111d35"], [216, "#000000"], [240, "#1d2b53"]] },
  a3: { h: 6318, pieces: [{ src: "a3-0", y: 28, h: 312 }], stops: [[0, "#1d2b53"], [4, "#000000"], [10, "#422136"], [16, "#be1250"], [22, "#000000"], [340, "#be1250"], [346, "#422136"], [358, "#000000"], [364, "#111d35"], [610, "#111c31"], [611, "#111d35"]] },
  a4: { h: 9156, pieces: [{ src: "a4-0", y: 28, h: 312 }, { src: "a4-1", y: 4378, h: 16 }, { src: "a4-2", y: 7554, h: 16 }], stops: [[0, "#111d35"], [4, "#000000"], [10, "#422136"], [16, "#be1250"], [22, "#000000"], [364, "#7e2553"], [4394, "#422136"], [7570, "#111d35"]] },
  a5: { h: 4538, pieces: [{ src: "a5-0", y: 34, h: 234 }], stops: [[0, "#111d35"]] },
  a6: { h: 1264, pieces: [{ src: "a6-0", y: 58, h: 210 }], stops: [[0, "#111d35"]] },
  dawn: { h: 1468, pieces: [{ src: "dawn-0", y: 4, h: 16 }, { src: "dawn-1", y: 604, h: 16 }, { src: "dawn-2", y: 1012, h: 16 }, { src: "dawn-3", y: 1196, h: 212 }], stops: [[0, "#111d35"], [20, "#754665"], [620, "#be1250"], [1028, "#ff6e59"], [1407, "#ffccaa"]] },
};
