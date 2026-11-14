import { Suspense } from "react";
import type { Metadata } from "next";
import { PlayerSearch } from "@/components/player-search";

export const metadata: Metadata = {
  title: "Buscar jugador",
};

export default function SearchPage() {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ribbon">
        Jugadores
      </p>
      <h1 className="mt-2 font-serif text-5xl leading-tight text-ink">
        Busca un nombre de la tabla
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
        Escribe el nombre exacto con el que corrías, o un trozo. Verás cada
        competición en la que aparece, el puesto mundial y el puesto de su
        región.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-ink-soft">Abriendo la búsqueda…</p>}>
          <PlayerSearch />
        </Suspense>
      </div>
    </div>
  );
}
