"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { RankingEntry } from "@/lib/types";
import {
  characterName,
  controllerName,
  countryName,
  fold,
  regionName,
  vehicleName,
} from "@/lib/names";
import { Input } from "@/components/ui/input";
import { catalog } from "@/lib/archive";

export function RankingTable({ rows }: { rows: RankingEntry[] }) {
  const [query, setQuery] = useState("");
  const threshold = catalog.anomalyThresholdMs;
  const visible = useMemo(() => {
    const needle = fold(query.trim());
    if (!needle) return rows;
    return rows.filter((row) => fold(row.player).includes(needle));
  }, [query, rows]);

  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-line bg-card px-4 py-8 text-center text-ink-soft">
        Esta clasificación no tiene filas en la copia. La web de origen tampoco
        las publica.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="w-full sm:max-w-sm">
          <span className="sr-only">Filtrar por jugador</span>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filtrar por nombre"
          />
        </label>
        <p className="text-sm text-ink-soft">
          {visible.length} de {rows.length} tiempos
        </p>
      </div>
      {visible.length === 0 ? (
        <p className="text-ink-soft">
          Nadie en esta tabla se llama así. Prueba con parte del nombre.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <caption className="sr-only">Clasificación de la competición</caption>
            <thead className="bg-paper-deep text-ink-soft">
              <tr>
                {[
                  "Puesto",
                  "Jugador",
                  "Tiempo",
                  "País",
                  "Personaje",
                  "Vehículo",
                  "Mando",
                  "Fecha",
                ].map((heading) => (
                  <th key={heading} scope="col" className="px-3 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => {
                const anomalous = row.timeMs < threshold;
                return (
                  <tr
                    key={`${row.rank}-${row.player}-${row.timeMs}`}
                    className="border-t border-line odd:bg-card"
                  >
                    <td className="px-3 py-2.5 font-serif text-lg text-ink">
                      {row.rank}
                    </td>
                    <td className="px-3 py-2.5 font-semibold">
                      <Link
                        href={`/buscar?nombre=${encodeURIComponent(row.player)}`}
                        className="underline decoration-line underline-offset-4 hover:decoration-ribbon"
                      >
                        {row.player}
                      </Link>
                    </td>
                    <td
                      className={
                        anomalous
                          ? "px-3 py-2.5 text-ribbon"
                          : "px-3 py-2.5 font-medium"
                      }
                      title={
                        anomalous
                          ? "Tiempo anómalo. El servidor oficial aceptó marcas imposibles."
                          : undefined
                      }
                    >
                      {row.time}
                    </td>
                    <td className="px-3 py-2.5">
                      {countryName(row.country)}
                      <span className="block text-xs text-ink-soft">
                        {regionName(row.region)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">{characterName(row.character)}</td>
                    <td className="px-3 py-2.5">{vehicleName(row.vehicle)}</td>
                    <td className="px-3 py-2.5">{controllerName(row.controller)}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-ink-soft">
                      {row.date || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
