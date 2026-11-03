"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./Sheet.module.css";

/**
 * Bottom sheet for phones: a native <dialog> that slides up from the bottom
 * edge, with a grab handle, a scrim and a title. Closes on scrim tap, Escape
 * or the close button; focus returns to the opener (native dialog behaviour).
 * Used by the mobile menu and the chapter picker.
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
  dark = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Dark surface (case-study pages). */
  dark?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.sheet}
      data-dark={dark ? "" : undefined}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => {
        // Only the scrim (the dialog's own box, outside the panel) closes.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.panel}>
        <span className={styles.handle} aria-hidden="true" />
        <div className={styles.head}>
          <p className={styles.title}>{title}</p>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </dialog>
  );
}
