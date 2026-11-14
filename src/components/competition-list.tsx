"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CompetitionSummary } from "@/lib/types";
import {
  challengeSummary,
  countryName,
  courseName,
  formatRange,
  restrictionName,
} from "@/lib/names";
import { Button } from "@/components/ui/button";

const YEARS = [2008, 2009, 2010, 2011, 2012, 2013, 2014];

export function CompetitionList({
  competitions,
}: {
  competitions: CompetitionSummary[];
}) {
  const [year, setYear] = useState<number | "all">("all");
  const visible = useMemo(
    () =>
      competitions.filter((competition) =>
        year === "all" ? true : competition.start.startsWith(String(year)),
      ),
    [competitions, year],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Año">
        <Button
          type="button"
          size="sm"
          variant={year === "all" ? "default" : "outline"}
          onClick={() => setYear("all")}
        >
          Todas
        </Button>
        {YEARS.map((option) => (
          <Button
            key={option}
            type="button"
            size="sm"
            variant={year === option ? "default" : "outline"}
            onClick={() => setYear(option)}
          >
            {option}
          </Button>
        ))}
      </div>
      <p className="mt-4 text-sm text-ink-soft">
        {visible.length} competiciones
        {year === "all" ? "" : ` en ${year}`}
      </p>
      <ol className="mt-3 divide-y divide-line border-y border-line">
        {visible.map((competition) => {
          const winner = competition.champion;
          return (
            <li key={competition.id}>
              <Link
                href={`/competicion/${competition.id}`}
                className="grid gap-2 py-4 hover:bg-paper-deep/60 sm:grid-cols-[4.5rem_1fr_auto] sm:items-center sm:gap-6"
              >
                <p className="font-serif text-3xl leading-none text-ribbon">
                  {competition.id}
                </p>
                <div>
                  <p className="font-serif text-xl leading-tight text-ink">
                    {courseName(competition.course)}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">
                    {formatRange(competition.start, competition.end)}
                    {competition.restrictions
                      ? ` · ${restrictionName(competition.restrictions)}`
                      : ""}
                    {competition.repeatOf
                      ? ` · Repetición de la competición ${competition.repeatOf}`
                      : ""}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">
                    {challengeSummary(competition.description)}
                  </p>
                </div>
                <div className="sm:text-right">
                  {winner ? (
                    <>
                      <p className="font-semibold text-ink">{winner.player}</p>
                      <p className="font-serif text-lg text-ink">
                        {winner.time}
                      </p>
                      <p className="text-sm text-ink-soft">
                        {countryName(winner.country)}
                        {winner.anomalous ? " · tiempo anómalo" : ""}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-ink-soft">Sin tiempos</p>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
