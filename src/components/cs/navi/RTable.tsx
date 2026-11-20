import type { ReactNode } from "react";
import cs from "../cs.module.css";
import s from "./navi.module.css";

/**
 * A table that reads as a table on wide screens and as one card per row on
 * phones (≤700px): the first cell becomes the card's title, every other cell
 * gets its column name as a small label above it. Explicit ARIA roles keep
 * the table semantics when the phone layout switches the rows to blocks.
 *
 * `strong`: the column drawn in the strong text colour (default: the first).
 * `labelFirst`: label the first cell too, instead of making it the title
 * (for two-column before/after tables).
 */
export function RTable({
  caption,
  head,
  rows,
  strong = 0,
  labelFirst = false,
}: {
  caption?: string;
  head: string[];
  rows: ReactNode[][];
  strong?: number;
  labelFirst?: boolean;
}) {
  return (
    <div className={s.rtWrap}>
      <table className={`${s.table} ${s.rt} ${labelFirst ? s.rtLabelled : ""}`} role="table">
        {caption && <caption className={s.caption}>{caption}</caption>}
        <thead role="rowgroup">
          <tr role="row">{head.map((h) => <th key={h} role="columnheader" scope="col">{h}</th>)}</tr>
        </thead>
        <tbody role="rowgroup">
          {rows.map((r, i) => (
            <tr key={i} role="row">
              {r.map((c, j) => (
                <td key={j} role="cell" data-label={head[j]} className={j === strong ? cs.strong : undefined}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
