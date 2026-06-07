import React from "react";
import { db } from "@/app/db";
import { eq } from "drizzle-orm";
import { tickets, projects, type Project, type Ticket } from "@/app/db/schema";
import { notFound } from "next/navigation";
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import Link from "next/link";

interface pageProps {
  params: Promise<{ id: string }>;
}

const priorityColors = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

const statusColors = {
  backlog: "bg-gray-100 text-gray-700",
  todo: "bg-orange-100 text-orange-700",
  in_progress: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
};

export default async function ProjectPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;

  const rows = await db
    .select({
      pId: projects.id,
      pName: projects.name,
      tickets: tickets,
    })
    .from(projects)
    .where(eq(projects.id, id))
    .leftJoin(tickets, eq(tickets.project_id, projects.id));

  const grouped = rows.reduce(
    (acc, row, index) => {
      const pId = row.pId;

      if (!acc[index]) {
        acc[index] = {
          pId: row.pId,
          pName: row.pName,
          tickets: [],
        };
      }
      if (row.tickets) {
        acc[index].tickets.push(row.tickets);
      }
      return acc;
    },
    {} as Record<number, { pId: string; pName: string; tickets: Ticket[] }>,
  );

  const data = Object.values(grouped);

  if (data.length === 0) {
    notFound();
  }

  return (
    <main>
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl font-normal`}>
          Project: {data[0].pName}
        </h1>
        <Link
          href="/dashboard/tickets/create"
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <span className="hidden md:block">+ Create Ticket</span>{" "}
        </Link>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search tickets..." />
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((projectWithTickets, index) => (
          <div key={index}>
            {projectWithTickets.tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white p-4 border rounded-lg border-gray-400"
              >
                <h3 className={`${lusitana.className} mb-2 font-normal`}>
                  {ticket.name}
                </h3>
                <p className="text-sm text-gray-500">{ticket.description}</p>
                <p
                  className={`mt-2 mx-2 inline-block rounded-lg px-2 py-1 text-sm text-gray-500 ${statusColors[ticket.status]}`}
                >
                  {ticket.status}
                </p>
                <p
                  className={`mt-2 mx-2 inline-block rounded-lg px-2 py-1 text-sm text-gray-500 ${priorityColors[ticket.priority]}`}
                >
                  {ticket.priority}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
