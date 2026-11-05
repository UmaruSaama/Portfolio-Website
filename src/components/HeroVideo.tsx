"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Muted looping walkthrough in the hero iPad. Plays on its own unless the
 * visitor asked for reduced motion; a click (or Enter/Space) pauses and
 * resumes it, so the loop never runs without a way to stop it.
 */
export function HeroVideo({
  src,
  poster,
  label,
  className,
}: {
  src: string;
  poster: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().catch(() => {});
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="auto"
      aria-label={`${label} ${paused ? "Paused. Activate to play." : "Playing. Activate to pause."}`}
      role="button"
      tabIndex={0}
      onPlay={() => setPaused(false)}
      onPause={() => setPaused(true)}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
    />
  );
}
