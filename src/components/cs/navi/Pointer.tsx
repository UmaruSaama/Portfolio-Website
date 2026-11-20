"use client";

import { openAppendix } from "../AppendixPointer";
import p from "./pointer.module.css";

/** "→ Appendix C · The metric and the economics": opens the slide-over appendix at that section. */
export function Pointer({ id, label }: { id: string; label: string }) {
  return (
    <button type="button" className={p.pointer} aria-haspopup="dialog" onClick={() => openAppendix(id)}>
      <span aria-hidden="true">→</span> Appendix {id.toUpperCase()} <span className={p.label}>· {label}</span>
    </button>
  );
}

export function Pointers({ items }: { items: [string, string][] }) {
  return <div className={p.row}>{items.map(([id, label]) => <Pointer key={id} id={id} label={label} />)}</div>;
}
