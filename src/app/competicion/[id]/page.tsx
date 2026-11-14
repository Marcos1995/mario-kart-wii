import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompetitionView } from "@/components/competition-view";
import { catalog, competitionById } from "@/lib/archive";
import { courseName } from "@/lib/names";

export function generateStaticParams() {
  return catalog.competitions.map((competition) => ({
    id: String(competition.id),
  }));
}

export async function generateMetadata(
  props: PageProps<"/competicion/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const competition = competitionById(Number(id));
  if (!competition) return { title: "Competición" };
  return { title: `${competition.id}. ${courseName(competition.course)}` };
}

export default async function CompetitionPage(
  props: PageProps<"/competicion/[id]">,
) {
  const { id } = await props.params;
  const competition = competitionById(Number(id));
  if (!competition) notFound();
  return <CompetitionView competition={competition} />;
}
