import catalogJson from "../../public/data/catalog.json";
import leadersJson from "../../public/data/leaders.json";
import type { Catalog, CompetitionSummary, Leaders } from "@/lib/types";

export const catalog = catalogJson as Catalog;
export const leaders = leadersJson as Leaders;

export function competitionById(id: number): CompetitionSummary | undefined {
  return catalog.competitions.find((competition) => competition.id === id);
}
