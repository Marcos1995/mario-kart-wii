"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CompetitionSummary, RankingFile } from "@/lib/types";
import {
  challengeSummary,
  characterName,
  controllerName,
  countryName,
  courseName,
  formatRange,
  regionName,
  restrictionName,
  vehicleName,
} from "@/lib/names";
import { Button } from "@/components/ui/button";
import { RankingTable } from "@/components/ranking-table";
import { publicUrl } from "@/lib/base-path";

const SCOPES = [
  { id: "worldwide", label: "Mundial" },
  { id: "Europe", label: "Europa" },
  { id: "Japan", label: "Japón" },
  { id: "North America", label: "Norteamérica" },
  { id: "Australia", label: "Australia" },
  { id: "Korea", label: "Corea" },
] as const;

type ScopeId = (typeof SCOPES)[number]["id"];

export function CompetitionView({
  competition,
}: {
  competition: CompetitionSummary;
}) {
  const [scope, setScope] = useState<ScopeId>("worldwide");
  const [file, setFile] = useState<RankingFile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const padded = String(competition.id).padStart(3, "0");
    fetch(publicUrl(`/data/rankings/${padded}.json`))
      .then((response) => {
        if (!response.ok) throw new Error("missing");
        return response.json();
      })
      .then((data: RankingFile) => {
        if (!cancelled) setFile(data);
      })
      .catch(() => {
        if (!cancelled) setError("No se ha podido abrir la tabla guardada.");
      });
    return () => {
      cancelled = true;
    };
  }, [competition.id]);

  const rows =
    file == null
      ? []
      : scope === "worldwide"
        ? file.worldwide
        : file.regions[scope];
  const winner = competition.champion;
  const official = competition.official;
  const displaced =
    official &&
    winner &&
    (official.player !== winner.player || official.timeMs !== winner.timeMs);

  return (
    <article>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ribbon">
        Competición {competition.id}
      </p>
      <h1 className="mt-2 font-serif text-4xl leading-tight text-ink sm:text-5xl">
        {courseName(competition.course)}
      </h1>
      <p className="mt-3 text-lg text-ink-soft">
        {formatRange(competition.start, competition.end)}
      </p>
      <p className="mt-4 max-w-2xl text-lg leading-7 text-ink">
        {challengeSummary(competition.description)}
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-sm text-ink-soft">
        {competition.restrictions ? (
          <span className="rounded-full bg-paper-deep px-3 py-1">
            {restrictionName(competition.restrictions)}
          </span>
        ) : null}
        {competition.repeatOf ? (
          <Link
            href={`/competicion/${competition.repeatOf}`}
            className="rounded-full bg-paper-deep px-3 py-1 underline"
          >
            Repetición de la competición {competition.repeatOf}
          </Link>
        ) : (
          <span className="rounded-full bg-paper-deep px-3 py-1">
            Primera vez de esta prueba
          </span>
        )}
      </div>
      <details className="mt-4 max-w-2xl text-sm text-ink-soft">
        <summary className="cursor-pointer font-semibold text-ink">
          Descripción en inglés, de la Super Mario Wiki
        </summary>
        <p className="mt-2 leading-6">{competition.description}</p>
      </details>

      {winner ? (
        <section className="mt-8 grid gap-4 rounded-3xl border border-line bg-card p-5 sm:grid-cols-[auto_1fr] sm:p-6">
          <p className="font-serif text-5xl leading-none text-gold">1</p>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">
              Campeón del mundo
            </p>
            <p className="mt-1 font-serif text-3xl text-ink">
              <Link
                href={`/buscar?nombre=${encodeURIComponent(winner.player)}`}
                className="underline decoration-line underline-offset-4 hover:decoration-ribbon"
              >
                {winner.player}
              </Link>
            </p>
            <p className="mt-1 font-serif text-2xl">{winner.time}</p>
            <p className="mt-2 text-ink-soft">
              {countryName(winner.country)} · {characterName(winner.character)} ·{" "}
              {vehicleName(winner.vehicle)} · {controllerName(winner.controller)}
            </p>
            {displaced && official ? (
              <p className="mt-3 text-sm leading-6 text-ribbon">
                El puesto 1 de la tabla oficial es {official.player} con{" "}
                {official.time}. Es un tiempo anómalo, así que el campeonato
                cuenta para {winner.player}.
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      <div
        className="mt-8 flex gap-2 overflow-x-auto pb-1"
        role="group"
        aria-label="Clasificación"
      >
        {SCOPES.map((option) => (
          <Button
            key={option.id}
            type="button"
            size="sm"
            variant={scope === option.id ? "ribbon" : "outline"}
            onClick={() => setScope(option.id)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      <p className="mt-3 text-sm text-ink-soft">
        {regionName(scope === "worldwide" ? "Worldwide" : scope)}
        {file ? ` · ${rows.length} tiempos guardados` : ""}
      </p>
      <div className="mt-4">
        {error ? (
          <p className="rounded-2xl border border-ribbon/40 bg-card px-4 py-6 text-ribbon">
            {error}
          </p>
        ) : file == null ? (
          <p className="text-ink-soft">Abriendo la tabla guardada…</p>
        ) : (
          <RankingTable rows={rows} />
        )}
      </div>
    </article>
  );
}
