"use client";

import Link from "next/link";
import { useState } from "react";
import type { Leader } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { courseName } from "@/lib/names";
import { competitionById } from "@/lib/archive";

export function LeadersBoard({
  boards,
}: {
  boards: {
    id: string;
    label: string;
    singular: string;
    plural: string;
    rows: Leader[];
  }[];
}) {
  const available = boards.filter((board) => board.rows.length > 0);
  const [current, setCurrent] = useState(available[0]?.id ?? "");
  const board = available.find((item) => item.id === current) ?? available[0];

  if (!board) {
    return <p>Todavía no hay campeones en la copia.</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Clasificación histórica">
        {available.map((item) => (
          <Button
            key={item.id}
            type="button"
            size="sm"
            variant={item.id === board.id ? "default" : "outline"}
            onClick={() => setCurrent(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <ol className="mt-6 divide-y divide-line border-y border-line">
        {board.rows.map((row, index) => (
          <li key={row.player} className="grid gap-3 py-4 sm:grid-cols-[3rem_1fr]">
            <p className="font-serif text-3xl leading-none text-ribbon">
              {index + 1}
            </p>
            <div>
              <p className="font-serif text-2xl text-ink">
                <Link
                  href={`/buscar?nombre=${encodeURIComponent(row.player)}`}
                  className="underline decoration-line underline-offset-4 hover:decoration-ribbon"
                >
                  {row.player}
                </Link>
              </p>
              <p className="text-ink-soft">
                {row.count} {row.count === 1 ? board.singular : board.plural}
              </p>
              <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                {row.competitions.map((id) => {
                  const competition = competitionById(id);
                  return (
                    <Link
                      key={id}
                      href={`/competicion/${id}`}
                      className="text-ink-soft underline decoration-line underline-offset-4 hover:text-ink"
                    >
                      {id}
                      {competition ? ` ${courseName(competition.course)}` : ""}
                    </Link>
                  );
                })}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
