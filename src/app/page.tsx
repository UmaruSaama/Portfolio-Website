import { ProjectStage } from "@/components/ProjectStage";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <main>
      <ProjectStage projects={projects} />
    </main>
  );
}
