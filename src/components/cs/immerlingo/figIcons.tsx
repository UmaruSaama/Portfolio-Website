// 16px stroke icons for the figure toolbar (Figma "Icon / desktop|tablet|mobile|cursor|film").
const P = { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", "aria-hidden": true } as const;
const S = { stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const IconDesktop = () => (
  <svg {...P}>
    <rect x="1.75" y="2.5" width="12.5" height="8.5" rx="1.2" {...S} />
    <path d="M5.5 13.5h5M8 11v2.5" {...S} />
  </svg>
);
export const IconTablet = () => (
  <svg {...P}>
    <rect x="3" y="1.75" width="10" height="12.5" rx="1.6" {...S} />
    <path d="M7 12h2" {...S} />
  </svg>
);
export const IconMobile = () => (
  <svg {...P}>
    <rect x="4.5" y="1.75" width="7" height="12.5" rx="1.6" {...S} />
    <path d="M7.25 12h1.5" {...S} />
  </svg>
);
export const IconPortrait = () => (
  <svg {...P}>
    <rect x="4.5" y="2" width="7" height="12" rx="1.4" {...S} />
  </svg>
);
export const IconLandscape = () => (
  <svg {...P}>
    <rect x="2" y="4.5" width="12" height="7" rx="1.4" {...S} />
  </svg>
);
export const IconCursor = () => (
  <svg {...P}>
    <path d="M3.5 2.5l9 3.6-3.9 1.4-1.4 3.9-3.7-8.9z" {...S} />
    <path d="M8.6 8.6l3.4 3.4" {...S} />
  </svg>
);
export const IconFilm = () => (
  <svg {...P}>
    <rect x="2" y="2.5" width="12" height="11" rx="1.4" {...S} />
    <path d="M5 2.5v11M11 2.5v11M2 6h3M2 10h3M11 6h3M11 10h3" {...S} />
  </svg>
);
