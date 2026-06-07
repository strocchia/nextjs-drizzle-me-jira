import { Suspense } from "react";
import Link from "next/link";
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import ProjectTable from "@/app/ui/projects-table";
import ProjectList from "@/app/ui/ProjectList";

export default async function ProjectsPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Projects</h1>
        <Link href="/dashboard/projects/create">+ Create Project</Link>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search projects..." />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        {/* <ProjectTable query={query} currentPage={currentPage} /> */}
        <ProjectList query={query} />
      </Suspense>
    </div>
  );
}
