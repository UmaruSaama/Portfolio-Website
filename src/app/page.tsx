import { ProjectStage } from "@/components/ProjectStage";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <main>
      <h1 className="visually-hidden">Shivam, product designer: selected work</h1>
      <ProjectStage projects={projects} />
    </main>
  );
}
