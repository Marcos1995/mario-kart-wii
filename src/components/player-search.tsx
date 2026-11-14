"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { PlayerRecord } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { courseName, fold, formatMs, SCOPE_LABEL } from "@/lib/names";
import { competitionById } from "@/lib/archive";
import { publicUrl } from "@/lib/base-path";

let cachedPlayers: PlayerRecord[] | null = null;

async function loadPlayers() {
  if (cachedPlayers) return cachedPlayers;
  const response = await fetch(publicUrl("/data/players.json"));
  if (!response.ok) throw new Error("players");
  cachedPlayers = (await response.json()) as PlayerRecord[];
  return cachedPlayers;
}

export function PlayerSearch() {
  const params = useSearchParams();
  const router = useRouter();
  const urlName = params.get("nombre") ?? "";
  const [query, setQuery] = useState(urlName);
  const [trackedUrl, setTrackedUrl] = useState(urlName);
  const [players, setPlayers] = useState<PlayerRecord[] | null>(cachedPlayers);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(urlName);

  if (trackedUrl !== urlName) {
    setTrackedUrl(urlName);
    setQuery(urlName);
    setSelected(urlName);
  }

  useEffect(() => {
    let cancelled = false;
    loadPlayers()
      .then((list) => {
        if (!cancelled) setPlayers(list);
      })
      .catch(() => {
        if (!cancelled) setError("No se ha podido abrir el censo de jugadores.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const matches = useMemo(() => {
    if (!players) return [];
    const needle = fold(query.trim());
    if (!needle) return [];
    return players
      .filter((player) => fold(player.name).includes(needle))
      .sort(
        (a, b) =>
          b.worldTitles.length - a.worldTitles.length ||
          a.name.localeCompare(b.name),
      )
      .slice(0, 30);
  }, [players, query]);

  const exact =
    players?.find((player) => player.name === selected) ??
    matches.find((player) => fold(player.name) === fold(query.trim())) ??
    null;

  function choose(name: string) {
    setSelected(name);
    setQuery(name);
    router.replace(`/buscar?nombre=${encodeURIComponent(name)}`, {
      scroll: false,
    });
  }

  return (
    <div>
      <label className="block max-w-xl">
        <span className="mb-2 block text-sm font-semibold text-ink">
          Nombre tal como salía en la tabla
        </span>
        <Input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelected("");
          }}
          placeholder="Por ejemplo, jam"
          autoComplete="off"
        />
      </label>
      {error ? <p className="mt-4 text-ribbon">{error}</p> : null}
      {players == null && !error ? (
        <p className="mt-4 text-ink-soft">Abriendo el censo de jugadores…</p>
      ) : null}
      {query.trim() && players && matches.length === 0 ? (
        <p className="mt-6 text-ink-soft">
          No hay ningún nombre que contenga «{query.trim()}». Los nombres están
          escritos como en 2008, con símbolos y mayúsculas raras.
        </p>
      ) : null}
      {matches.length > 1 || (matches.length > 0 && !exact) ? (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {matches.map((player) => (
            <li key={player.name}>
              <button
                type="button"
                className="flex w-full items-baseline justify-between gap-4 py-3 text-left hover:bg-paper-deep/70"
                onClick={() => choose(player.name)}
              >
                <span className="font-semibold">{player.name}</span>
                <span className="text-sm text-ink-soft">
                  {player.worldTitles.length} mundiales · {player.results.length}{" "}
                  apariciones
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {exact ? <PlayerDetail player={exact} /> : null}
    </div>
  );
}

function PlayerDetail({ player }: { player: PlayerRecord }) {
  const grouped = new Map<number, typeof player.results>();
  for (const result of player.results) {
    const list = grouped.get(result[0]) ?? [];
    list.push(result);
    grouped.set(result[0], list);
  }
  const competitions = [...grouped.entries()].sort((a, b) => a[0] - b[0]);

  return (
    <section className="mt-8">
      <h2 className="font-serif text-4xl text-ink">{player.name}</h2>
      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Mundiales" value={player.worldTitles.length} />
        <Stat label="Europa" value={player.europeTitles.length} />
        <Stat label="Japón" value={player.japanTitles.length} />
        <Stat label="Podios mundiales" value={player.podiums.length} />
      </dl>
      <ol className="mt-6 divide-y divide-line border-y border-line">
        {competitions.map(([id, results]) => {
          const competition = competitionById(id);
          return (
            <li key={id} className="py-4">
              <Link
                href={`/competicion/${id}`}
                className="font-serif text-xl text-ink underline decoration-line underline-offset-4 hover:decoration-ribbon"
              >
                {id}. {competition ? courseName(competition.course) : "Competición"}
              </Link>
              {competition ? (
                <p className="text-sm text-ink-soft">
                  {competition.start.slice(0, 4)}
                </p>
              ) : null}
              <ul className="mt-2 space-y-1 text-sm">
                {results
                  .slice()
                  .sort((a, b) => a[1].localeCompare(b[1]))
                  .map((result) => (
                    <li key={`${result[1]}-${result[2]}`}>
                      {SCOPE_LABEL[result[1]] ?? result[1]} · puesto {result[2]} ·{" "}
                      {formatMs(result[3])}
                    </li>
                  ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line bg-card px-4 py-3">
      <dt className="text-sm text-ink-soft">{label}</dt>
      <dd className="font-serif text-3xl text-ink">{value}</dd>
    </div>
  );
}
