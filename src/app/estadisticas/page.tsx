import type { Metadata } from "next";
import { LeadersBoard } from "@/components/leaders-board";
import { leaders } from "@/lib/archive";

export const metadata: Metadata = {
  title: "Quién ganó más",
};

export default function StatsPage() {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ribbon">
        Historial
      </p>
      <h1 className="mt-2 font-serif text-5xl leading-tight text-ink">
        Quién ganó más veces
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
        Cada edición cuenta por separado, también cuando Nintendo repitió la
        misma prueba. Un mundial es el mejor tiempo real de la tabla mundial.
        Europa, Japón, Norteamérica y Australia cuentan el mejor tiempo real de
        su propia tabla. Dos nombres distintos son dos jugadores, aunque fueran
        la misma persona con otra cuenta.
      </p>
      <div className="mt-8">
        <LeadersBoard
          boards={[
            {
              id: "world",
              label: "Mundial",
              singular: "mundial",
              plural: "mundiales",
              rows: leaders.world,
            },
            {
              id: "europe",
              label: "Europa",
              singular: "título europeo",
              plural: "títulos europeos",
              rows: leaders.europe,
            },
            {
              id: "japan",
              label: "Japón",
              singular: "título japonés",
              plural: "títulos japoneses",
              rows: leaders.japan,
            },
            {
              id: "northAmerica",
              label: "Norteamérica",
              singular: "título norteamericano",
              plural: "títulos norteamericanos",
              rows: leaders.northAmerica,
            },
            {
              id: "australia",
              label: "Australia",
              singular: "título australiano",
              plural: "títulos australianos",
              rows: leaders.australia,
            },
            {
              id: "podiums",
              label: "Podios mundiales",
              singular: "podio mundial",
              plural: "podios mundiales",
              rows: leaders.podiums,
            },
          ]}
        />
      </div>
    </div>
  );
}
