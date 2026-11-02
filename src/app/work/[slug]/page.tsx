import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.filter((p) => !p.placeholder).map((p) => ({ slug: p.slug }));
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug && !p.placeholder);
  if (!project) notFound();

  return (
    <main style={{ minHeight: "100dvh", display: "grid", placeContent: "center", textAlign: "center", gap: 12 }}>
      <h1 style={{ fontSize: 40, fontWeight: 650 }}>{project.title.accent}</h1>
      <p style={{ color: "var(--label-secondary)" }}>The full case study page is next on the list.</p>
      <Link href="/" style={{ textDecoration: "underline" }}>
        Back to work
      </Link>
    </main>
  );
}
