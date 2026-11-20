"use client";

import { useEffect, useState } from "react";
import cs from "../cs.module.css";
import s from "./navi.module.css";

/**
 * The live prototype. Wide screens get it inline in an iframe; phones get a
 * launch card instead, because the prototype is built to fill a phone screen
 * and an iframe inside a scrolling page fights it for every swipe. The iframe
 * is only created once a wide screen is confirmed, so phones never load it
 * in the background. Both slots are in the server HTML, so nothing jumps.
 */
export function ProtoEmbed({ src, poster }: { src: string; poster: string }) {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <>
      <div className={s.protoWrap}>
        {wide && <iframe className={s.proto} src={src} title="Confirmed before you board: interactive prototype" loading="lazy" />}
      </div>
      <p className={`${cs.small} ${s.protoNote} ${s.protoWideOnly}`}>
        Coded, so signal, battery and time are real states.{" "}
        <a className={s.link} href={src} target="_blank" rel="noopener">Open full screen ↗</a>
      </p>

      <div className={s.protoLaunch}>
        {/* eslint-disable-next-line @next/next/no-img-element -- a fixed poster frame, already sized */}
        <img className={s.protoPoster} src={poster} alt="The prototype at 1:45 AM, offline at 6% battery" width={470} height={920} loading="lazy" />
        <div className={s.protoLaunchText}>
          <p className={cs.h3}>You’re Meera. It’s 1:45 AM.</p>
          <p className={cs.small}>Get the group of 4 into a bed. It opens full screen on your phone; signal, battery and time are real states. About 2 minutes.</p>
        </div>
        <a className={`${s.cta} ${s.protoLaunchCta}`} href={src} target="_blank" rel="noopener">Open the prototype ↗</a>
      </div>
    </>
  );
}
