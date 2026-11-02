import { notFound } from "next/navigation";

const sections = {
  motion: "Motion",
  archive: "Archive",
  about: "About me",
} as const;

type Section = keyof typeof sections;

export function generateStaticParams() {
  return Object.keys(sections).map((section) => ({ section }));
}

export default async function SectionPage({ params }: PageProps<"/[section]">) {
  const { section } = await params;
  if (!(section in sections)) notFound();

  return (
    <main style={{ minHeight: "100dvh", display: "grid", placeContent: "center", textAlign: "center", gap: 8 }}>
      <h1 style={{ fontSize: 40, fontWeight: 650 }}>{sections[section as Section]}</h1>
      <p style={{ color: "var(--label-secondary)" }}>This page is next on the list.</p>
    </main>
  );
}
