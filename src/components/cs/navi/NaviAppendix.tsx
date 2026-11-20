import type { ReactNode } from "react";
import { appendixAnchor } from "../appendix";
import cs from "../cs.module.css";
import { naviAppendixBlocks, naviAppendixIntro, naviAppendixSections, type Block } from "./appendixData";
import a from "./appendix.module.css";

export { naviAppendixSections };

/* Inline markup from the appendix markdown: **bold**, *italic*, and C-numbers as small citation chips. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\bC\d{3}\b)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
        if (p.startsWith("*") && p.endsWith("*") && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>;
        if (/^C\d{3}$/.test(p)) return <span key={i} className={a.cite}>{p}</span>;
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

function render(b: Block, i: number): ReactNode {
  switch (b.t) {
    case "h3": return <h4 key={i} className={a.h}><Inline text={b.text} /></h4>;
    case "p": return <p key={i} className={cs.small}><Inline text={b.text} /></p>;
    case "ul":
    case "ol": {
      const L = b.t;
      return (
        <L key={i} className={a.list}>
          {b.items.map((it, j) => (
            <li key={j}><Inline text={it.text} />{it.sub && <ul>{it.sub.map((s, k) => <li key={k}><Inline text={s} /></li>)}</ul>}</li>
          ))}
        </L>
      );
    }
    case "table":
      return (
        <div key={i} className={a.scroll}>
          <table className={a.table}>
            <thead><tr>{b.head.map((h, j) => <th key={j}><Inline text={h} /></th>)}</tr></thead>
            <tbody>{b.rows.map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k}><Inline text={c} /></td>)}</tr>)}</tbody>
          </table>
        </div>
      );
    case "kv":
      return (
        <dl key={i} className={a.kv}>
          {b.rows.map((r, j) => <div key={j}><dt><Inline text={r[0]} /></dt><dd><Inline text={r[1] ?? ""} /></dd></div>)}
        </dl>
      );
  }
}

/** Appendix A–J, rendered inside the shared slide-over AppendixPanel. */
export function NaviAppendix() {
  return (
    <div className={a.wrap}>
      {naviAppendixIntro.map(render)}
      {naviAppendixSections.map((s) => (
        <section key={s.id} id={appendixAnchor(s.id)} className={a.section} aria-labelledby={`ap-${s.id}`}>
          <h3 id={`ap-${s.id}`} className={a.title}><span className={a.letter}>{s.id.toUpperCase()}</span>{s.label}</h3>
          {(naviAppendixBlocks[s.id] ?? []).map(render)}
        </section>
      ))}
    </div>
  );
}
