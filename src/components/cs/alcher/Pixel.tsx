import type { CSSProperties, ElementType, ReactNode } from "react";
import "./fonts.css";
import "@fontsource/pixelify-sans/400.css";
import "@fontsource/pixelify-sans/700.css";
import s from "./Pixel.module.css";

/**
 * Pixel building blocks for the Alcheringa '25 case study. Every Figma
 * "Border" frame shares one bevel recipe in five colour sets (tones);
 * PixelBox draws it, so chapters only lay out what goes inside.
 */

export type Tone = "blue" | "pink" | "dark" | "gold" | "cream";

export function PixelBox({
  tone = "blue",
  as: Tag = "div",
  small = false,
  className,
  style,
  children,
  ...rest
}: {
  tone?: Tone;
  as?: ElementType;
  /** 3px cells instead of 4px (Figma's small "Persona moment" bubbles). */
  small?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
} & Record<string, unknown>) {
  return (
    <Tag
      className={`${s.box} ${className ?? ""}`}
      data-tone={tone}
      style={small ? { ...style, "--px": "3px" } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Inset well: black top/left edge, blue (or dim navy) bottom/right edge. */
export function Slot({
  as: Tag = "div",
  edge = "blue",
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  edge?: "blue" | "dim";
  className?: string;
  children?: ReactNode;
} & Record<string, unknown>) {
  return (
    <Tag className={`${s.slot} ${className ?? ""}`} data-edge={edge === "dim" ? "dim" : undefined} {...rest}>
      {children}
    </Tag>
  );
}

/** Text in the display pixel face (Brick Pixel). */
export function PixelText({
  as: Tag = "span",
  className,
  children,
  ...rest
}: { as?: ElementType; className?: string; children?: ReactNode } & Record<string, unknown>) {
  return (
    <Tag className={`${s.pixel} ${className ?? ""}`} {...rest}>
      {children}
    </Tag>
  );
}

/** Pink title plate (64 tall incl. shadow), e.g. "FOUR EDITIONS, FOUR TEAMS". */
export function Plate({
  as = "p",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <PixelBox tone="pink" as={as} className={`${s.plate} ${s.pixel} ${className ?? ""}`}>
      {children}
    </PixelBox>
  );
}

/** "Divider – pixel": two bars and a diamond (232 × 20). */
export function PixelDivider({ className }: { className?: string }) {
  return (
    <svg className={`${s.divider} ${s.icon} ${className ?? ""}`} viewBox="0 0 232 20" aria-hidden="true">
      <path
        fill="currentColor"
        d="M0 8h96v4H0zM136 8h96v4h-96zM92 4h4v12h-4zM136 4h4v12h-4zM112 0h8v4h-8zM108 4h16v4h-16zM104 8h24v4h-24zM108 12h16v4h-16zM112 16h8v4h-8z"
      />
    </svg>
  );
}

/** Green pixel tick (20 × 16, 4px cells). */
export function Tick({ className }: { className?: string }) {
  return (
    <svg className={`${s.icon} ${className ?? ""}`} width="20" height="16" viewBox="0 0 20 16" aria-hidden="true">
      <path fill="#00e436" d="M0 8h4v4H0zM4 12h4v4H4zM8 8h4v4H8zM12 4h4v4h-4zM16 0h4v4h-4z" />
    </svg>
  );
}

export { s as pixelStyles };
