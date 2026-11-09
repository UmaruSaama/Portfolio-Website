"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { MutedIcon, PauseIcon, PlayIcon, SoundIcon } from "./icons";
import action from "./Action.module.css";
import styles from "./FilmControls.module.css";

type Props = {
  /** The film element (read on demand: the <video> is keyed by slug and remounts). */
  getVideo: () => HTMLVideoElement | null;
  /** Re-subscribes when the project changes. */
  slug: string;
};

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

/**
 * Play/pause, sound and a scrubbable progress line for the card film.
 * State comes from the <video> element's own events, so whatever starts or
 * stops playback (the open/close timeline, the end of the film, a key press)
 * the buttons stay true to it.
 */
export function FilmControls({ getVideo, slug }: Props) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const v = getVideo();
    if (!v) return;
    const sync = () => {
      setPlaying(!v.paused && !v.ended);
      setMuted(v.muted);
      setDuration(v.duration || 0);
    };
    let raf = 0;
    const tick = () => {
      setTime(v.currentTime);
      raf = requestAnimationFrame(tick);
    };
    const onPlay = () => {
      sync();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    const onStop = () => {
      sync();
      cancelAnimationFrame(raf);
      setTime(v.currentTime);
    };
    const events: [string, () => void][] = [
      ["play", onPlay],
      ["pause", onStop],
      ["ended", onStop],
      ["seeked", () => setTime(v.currentTime)],
      ["volumechange", sync],
      ["loadedmetadata", sync],
      ["durationchange", sync],
    ];
    events.forEach(([n, f]) => v.addEventListener(n, f));
    sync();
    return () => {
      cancelAnimationFrame(raf);
      events.forEach(([n, f]) => v.removeEventListener(n, f));
    };
  }, [getVideo, slug]);

  const progress = duration ? time / duration : 0;

  return (
    <div className={styles.bar} data-film-controls>
      <button
        type="button"
        className={`${action.disc} ${action.glass} ${styles.btn}`}
        aria-label={playing ? "Pause" : "Play"}
        onClick={() => {
          const v = getVideo();
          if (!v) return;
          if (v.paused) v.play().catch(() => {});
          else v.pause();
        }}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>

      <label className={styles.track} style={{ "--p": progress } as CSSProperties}>
        <span className="visually-hidden">Seek</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={time}
          aria-valuetext={`${fmt(time)} of ${fmt(duration)}`}
          onChange={(e) => {
            const v = getVideo();
            if (v) v.currentTime = Number(e.target.value);
          }}
        />
      </label>

      <span className={styles.time} aria-hidden="true">
        {fmt(time)} / {fmt(duration)}
      </span>

      <button
        type="button"
        className={`${action.disc} ${action.glass} ${styles.btn}`}
        aria-label={muted ? "Unmute" : "Mute"}
        aria-pressed={muted}
        onClick={() => {
          const v = getVideo();
          if (v) v.muted = !v.muted;
        }}
      >
        {muted ? <MutedIcon /> : <SoundIcon />}
      </button>
    </div>
  );
}
