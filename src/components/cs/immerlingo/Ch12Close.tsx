import { Chapter } from "../Primitives";
import cs from "../cs.module.css";
import s from "./Ch12Close.module.css";

export function Ch12Close() {
  return (
    <Chapter id="close" label="Close">
      <div className={s.close}>
        <span className={s.divider} aria-hidden="true" />
        <div className={s.content}>
          <div className={s.badge}>
            <span className={s.ring} aria-hidden="true">
              {/* tabler-icons confetti */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 5h2M5 4v2M11.5 4l-.5 2M18 5h2M19 4v2M15 9l-1 1M18 13l2-.5M18 19h2M19 18v2" />
                <path d="M14 16.518 7.482 10l-4.39 9.58a1 1 0 0 0 1.329 1.329L14 16.518Z" />
              </svg>
            </span>
            <h2 className={s.goal}>The goal</h2>
          </div>
          <p className={`${cs.h2} ${s.statement}`}>
            A few months on, Piyush watches One Piece without subtitles, and Orin reads the next
            light novel on release day. That&apos;s the whole point.
          </p>
        </div>
      </div>
    </Chapter>
  );
}
