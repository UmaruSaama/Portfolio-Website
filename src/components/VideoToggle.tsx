import { CloseIcon, PlayIcon } from "./icons";
import action from "./Action.module.css";
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
      className={action.action}
      aria-expanded={open}
      aria-controls={controls}
      onClick={onToggle}
    >
      <span className={action.disc} aria-hidden="true">
        {open ? (
          <CloseIcon />
        ) : (
          <span className={styles.play}>
            <PlayIcon />
          </span>
        )}
      </span>
      {open ? "Close video" : "Product video"}
    </button>
  );
}
