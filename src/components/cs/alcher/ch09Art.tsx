/**
 * Small pixel pieces of chapter 09, redrawn from the Figma vectors:
 * mascot (Icons/mascot v3), START flag, the goal pass ticket (Goal – pass)
 * and the toolbar cursor icon.
 */

/** Icons/mascot v3 (32 × 28, 2px cells). The map's player is the same art ×1.5. */
export function Mascot({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 28" shapeRendering="crispEdges" aria-hidden="true">
      <path
        fill="#000"
        d="M2 0h4v2H2zM26 0h4v2h-4zM0 2h2v2H0zM6 2h2v2H6zM24 2h2v2h-2zM30 2h2v2h-2zM0 4h2v2H0zM8 4h2v2H8zM22 4h2v2h-2zM30 4h2v2h-2zM0 6h2v2H0zM10 6h12v2H10zM30 6h2v2h-2zM0 8h2v2H0zM30 8h2v2h-2zM0 10h2v2H0zM30 10h2v2h-2zM0 12h2v2H0zM10 12h2v2h-2zM22 12h2v2h-2zM30 12h2v2h-2zM0 14h2v2H0zM8 14h4v2H8zM20 14h4v2h-4zM30 14h2v2h-2zM0 16h2v2H0zM8 16h4v2H8zM20 16h4v2h-4zM30 16h2v2h-2zM0 18h2v2H0zM30 18h2v2h-2zM0 20h2v2H0zM12 20h2v2h-2zM18 20h2v2h-2zM30 20h2v2h-2zM0 22h2v2H0zM14 22h4v2h-4zM30 22h2v2h-2zM2 24h2v2H2zM28 24h2v2h-2zM4 26h24v2H4z"
      />
      <path
        fill="#ff77a8"
        d="M2 2h4v2H2zM26 2h4v2h-4zM2 4h2v2H2zM6 4h2v2H6zM24 4h2v2h-2zM28 4h2v2h-2zM4 6h6v2H4zM22 6h6v2h-6zM4 18h4v2H4zM14 18h4v2h-4zM24 18h4v2h-4zM4 20h4v2H4zM24 20h4v2h-4z"
      />
      <path fill="#be1250" d="M4 4h2v2H4zM26 4h2v2h-2z" />
      <path
        fill="#fff1e8"
        d="M2 6h2v2H2zM2 8h26v4H2zM2 12h8v2H2zM12 12h10v2H12zM24 12h4v2h-4zM2 14h6v4H2zM12 14h8v4h-8zM24 14h4v4h-4zM2 18h2v4H2zM8 18h6v2H8zM18 18h6v2h-6zM8 20h4v2H8zM14 20h4v2h-4zM20 20h4v2h-4zM2 22h12v2H2zM18 22h8v2h-8zM8 24h16v2H8z"
      />
      <path fill="#ffccaa" d="M28 6h2v16h-2zM26 22h4v2h-4zM4 24h4v2H4zM24 24h4v2h-4z" />
    </svg>
  );
}

/** Start flag (32 × 88): cream pole, stepped yellow pennant. */
export function StartFlag({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 88" shapeRendering="crispEdges" aria-hidden="true">
      <path fill="#fff1e8" d="M0 0h4v88H0z" />
      <path fill="#ffec27" d="M4 0h28v8H4zM4 8h20v8H4zM4 16h12v8H4z" />
    </svg>
  );
}

/** Toolbar hint icon (Figma "Icon / cursor", 16 × 16). */
export function CursorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <g transform="translate(1.49 1.49)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.17 11.84 4.51 4.51l7.33 2.67-3.33 1.33-1.34 3.33ZM8.51 8.51l3.33 3.33M3.3 0l.52 1.93M1.93 3.82 0 3.3M7.81 1.21 6.39 2.62M2.62 6.39 1.21 7.81" />
      </g>
    </svg>
  );
}

/* ---------- Goal – pass (205 × 105): the Night 1 pronite pass ---------- */

const QR_ROWS = [
  [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11],
  [0, 1, 2, 6, 7, 9, 10, 11],
  [0, 1, 2, 3, 4, 7, 8, 9, 10, 11],
  [0, 5, 6, 8, 9],
  [0, 1, 4, 7, 9],
  [1, 2, 8, 9, 11],
  [2, 4, 11],
  [2, 5, 6, 7, 9, 10],
  [0, 2, 3, 4, 8],
  [0, 1, 2, 4, 8, 10],
  [0, 1, 2, 5, 6, 9, 11],
  [0, 1, 2, 6, 7, 10],
];
const QR = QR_ROWS.flatMap((cols, j) =>
  cols.map((i) => `M${(146.94 + 3.72 * i).toFixed(2)} ${(20.97 + 3.72 * j).toFixed(2)}h3.72v3.72h-3.72z`),
).join("");

type R = [x: number, y: number, w: number, h: number, fill: string];
const RECTS: R[] = [
  // main card: shadow, rings, plum fill, highlight / lowlight, glint, rivets
  [5.58, 1.86, 122.84, 102.14, "#000"],
  [0, 7.44, 134, 90.98, "#000"],
  [5.58, 0, 122.84, 102.14, "#000"],
  [0, 5.58, 134, 90.98, "#000"],
  [5.58, 1.86, 122.84, 98.42, "#be1250"],
  [1.86, 5.58, 130.28, 90.98, "#be1250"],
  [5.58, 3.72, 122.84, 94.7, "#ff77a8"],
  [3.72, 5.58, 126.56, 90.98, "#ff77a8"],
  [7.44, 5.58, 119.12, 90.98, "#7e2553"],
  [5.58, 7.44, 122.84, 87.26, "#7e2553"],
  [5.58, 3.72, 122.84, 1.86, "#ffccaa"],
  [3.72, 5.58, 1.86, 90.98, "#ffccaa"],
  [5.58, 96.56, 122.84, 1.86, "#422136"],
  [128.42, 5.58, 1.86, 90.98, "#422136"],
  [7.44, 5.58, 3.72, 1.86, "#fff1e8"],
  [9.3, 9.3, 1.86, 1.86, "#ffccaa"],
  [122.84, 9.3, 1.86, 1.86, "#ffccaa"],
  [9.3, 90.98, 1.86, 1.86, "#ffccaa"],
  [122.84, 90.98, 1.86, 1.86, "#ffccaa"],
  // "Pronite pass" tag
  [13.02, 11.16, 57.28, 17, "#000"],
  [11.16, 13.02, 61, 13.28, "#000"],
  [14.88, 13.02, 53.56, 13.28, "#be1250"],
  [13.02, 14.88, 57.28, 9.56, "#be1250"],
  [16.74, 14.88, 49.84, 9.56, "#ff77a8"],
  [14.88, 16.74, 53.56, 5.84, "#ff77a8"],
  [16.74, 14.88, 49.84, 1.86, "#ffccaa"],
  [14.88, 16.74, 1.86, 5.84, "#ffccaa"],
  [16.74, 22.58, 49.84, 1.86, "#be1250"],
  [66.58, 16.74, 1.86, 5.84, "#be1250"],
  // stub
  [139.5, 0, 59.84, 104, "#000"],
  [133.92, 5.58, 71, 92.84, "#000"],
  [139.5, 1.86, 59.84, 100.28, "#ffccaa"],
  [135.78, 5.58, 67.28, 92.84, "#ffccaa"],
  [139.5, 3.72, 59.84, 96.56, "#fff1e8"],
  [137.64, 5.58, 63.56, 92.84, "#fff1e8"],
  [139.5, 98.42, 59.84, 1.86, "#ffccaa"],
];

/** Baselines from Figma's text boxes: Game Tape ascent 0.857 em, descent
 *  0.191 em, centred in the Figma line height. */
export function GoalPass({ className, textClassName }: { className?: string; textClassName?: string }) {
  return (
    <svg className={className} viewBox="0 0 204.6 104.2" role="img" aria-label="Pronite pass, Night 1, 9 Mar, gates 7 PM, Riya Das, scan at gate">
      <defs>
        {/* Figma: eight 1.86px black drop shadows = a square 1.86 outline */}
        <filter id="goal-outline" x="-10%" y="-20%" width="120%" height="140%" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceAlpha" operator="dilate" radius="1.86" result="d" />
          <feFlood floodColor="#000" />
          <feComposite in2="d" operator="in" result="o" />
          <feMerge>
            <feMergeNode in="o" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g shapeRendering="crispEdges">
        {RECTS.map(([x, y, w, h, f], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill={f} />
        ))}
        <path fill="#000" d={QR} />
      </g>
      <g className={textClassName}>
        <text x="18.6" y="21.07" fontSize="8.68" fill="#1d2b53">
          Pronite pass
        </text>
        <text x="11.16" y="49.8" fontSize="19.22" fill="#fff1e8" filter="url(#goal-outline)">
          Night 1
        </text>
        <text x="11.16" y="67.53" fontSize="8.68" fill="#c2c3c7">
          9 Mar · Gates 7 PM
        </text>
        <text x="11.16" y="88.41" fontSize="13.02" fill="#ffec27">
          Riya Das
        </text>
        <text x="169.26" y="83.38" fontSize="8.68" fill="#1d2b53" textAnchor="middle">
          Scan at gate
        </text>
      </g>
    </svg>
  );
}
