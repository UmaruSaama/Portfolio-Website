import { Chapter } from "../Primitives";
import s from "./Ch13Close.module.css";

/** 13 · Close (Figma 504:68869): credits line under a fading divider. */

/** tabler-icons "confetti" (outline, 24 grid). */
function Confetti() {
  return (
    <svg
      className={s.icon}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 5h2" />
      <path d="M5 4v2" />
      <path d="M11.5 4l-.5 2" />
      <path d="M18 5h2" />
      <path d="M19 4v2" />
      <path d="M15 9l-1 1" />
      <path d="M18 13l2 -.5" />
      <path d="M18 19h2" />
      <path d="M19 18v2" />
      <path d="M14 16.518l-6.518 -6.518l-4.39 9.58a1 1 0 0 0 1.329 1.329l9.579 -4.39z" />
    </svg>
  );
}

export function Ch13Close() {
  return (
    <Chapter id="close" label="Close" className={s.close}>
      <span className={s.divider} aria-hidden="true" />
      <div className={s.credits}>
        <div className={s.head}>
          <span className={s.mark}>
            <Confetti />
          </span>
          <h2 className={s.label}>Credits</h2>
        </div>
        <p className={s.line}>
          Thanks for playing through to the end. The full research, the appendix and the handover notes for the ’26
          team are one link away.
        </p>
      </div>
    </Chapter>
  );
}
