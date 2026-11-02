import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { CaseStudy } from "@/components/CaseStudy";
import { ArrowLeftIcon } from "@/components/icons";
import action from "@/components/Action.module.css";

export function generateStaticParams() {
  return projects.filter((p) => !p.placeholder).map((p) => ({ slug: p.slug }));
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug && !p.placeholder);
  if (!project) notFound();

  return (
    <main>
      <CaseStudy
        project={project}
        back={
          <Link href="/" className={`${action.action} ${action.onDark}`}>
            <span className={`${action.disc} ${action.glass}`} aria-hidden="true">
              <ArrowLeftIcon />
            </span>
            Work
          </Link>
        }
      />
    </main>
  );
}
