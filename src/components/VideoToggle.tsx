import styles from "./VideoToggle.module.css";

type Props = {
  open: boolean;
  controls: string;
  onToggle: () => void;
};

/** Side button: turns the project card into the video player and back. */
export function VideoToggle({ open, controls, onToggle }: Props) {
  return (
    <button
      type="button"
      className={styles.trigger}
      aria-expanded={open}
      aria-controls={controls}
      onClick={onToggle}
    >
      <span className={styles.icon} aria-hidden="true">
        {open ? (
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="14" height="16" viewBox="0 0 14 16" className={styles.play}>
            <path
              d="M0 1.6v12.8a1.2 1.2 0 0 0 1.8 1L13.4 9a1.2 1.2 0 0 0 0-2L1.8.6A1.2 1.2 0 0 0 0 1.6Z"
              fill="currentColor"
            />
          </svg>
        )}
      </span>
      {open ? "Close video" : "Product video"}
    </button>
  );
}
