/** Suspense shell for /work/[slug]: the case study's dark page colour, so a
 *  slow navigation never flashes white. Prerendered slugs skip it. */
export default function Loading() {
  return <main style={{ minHeight: "100vh", background: "#000" }} aria-busy="true" />;
}
