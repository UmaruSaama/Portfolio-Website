"use client";

import { useRef } from "react";
import styles from "./ProductVideo.module.css";

export function ProductVideo({ title, src }: { title: string; src?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  const open = () => dialog.current?.showModal();
  const close = () => {
    video.current?.pause();
    dialog.current?.close();
  };

  return (
    <>
      <button type="button" className={styles.trigger} onClick={open}>
        <span className={styles.play} aria-hidden="true">
          <svg width="14" height="16" viewBox="0 0 14 16">
            <path d="M0 1.6v12.8a1.2 1.2 0 0 0 1.8 1L13.4 9a1.2 1.2 0 0 0 0-2L1.8.6A1.2 1.2 0 0 0 0 1.6Z" fill="currentColor" />
          </svg>
        </span>
        Product video
      </button>

      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-label={`${title} product video`}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
        onClose={() => video.current?.pause()}
      >
        <div className={styles.frame}>
          {src ? (
            <video ref={video} src={src} controls autoPlay playsInline className={styles.video} />
          ) : (
            <p className={styles.empty}>The product video for {title} isn&rsquo;t added yet.</p>
          )}
        </div>
        <button type="button" className={styles.close} onClick={close}>
          Close
        </button>
      </dialog>
    </>
  );
}
