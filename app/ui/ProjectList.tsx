// src/components/ProjectList.tsx

import { db } from "@/app/db";
import { projects, type Project } from "@/app/db/schema";
import { eq, or, ilike } from "drizzle-orm";
import Link from "next/link";

const priorityColors = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

export default async function ProjectList({
  // projects,
  query,
}: {
  // projects: Project[];
  query: string;
}) {
  // if (projects.length === 0) {
  //   return (
  //     <p className="py-4 text-gray-400">No projects yet. Create one below.</p>
  //   );
  // }

  const allProjects = await db
    .select()
    .from(projects)
    .where(
      or(
        ilike(projects.name, `%${query}%`),
        ilike(projects.description, `%${query}%`),
      ),
    );

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
      {allProjects.map((project) => (
        <li
          key={project.id}
          className="flex items-center rounded-md border p-3"
        >
          <div className="flex items-center gap-3">
            <div>
              <Link href={`/dashboard/projects/${project.id}`}>
                <span className="text-base font-medium">{project.name}</span>
              </Link>
              <span className={`ml-5 inline-block rounded px-2 py-0.5 text-sm`}>
                {project.description}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
