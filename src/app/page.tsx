import Link from "next/link";
import { CompetitionList } from "@/components/competition-list";
import { catalog } from "@/lib/archive";
import { formatCopiedAt } from "@/lib/names";

export default function Home() {
  const rows = new Intl.NumberFormat("es").format(catalog.totalRows);

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ribbon">
        Canal Mario Kart
      </p>
      <h1 className="mt-2 max-w-3xl font-serif text-5xl leading-[1.05] text-ink sm:text-6xl">
        Las 145 competiciones, con cada tiempo que sigue existiendo.
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-soft">
        Nintendo las publicó dos veces al mes, del 1 al 10 y del 15 al 25,
        entre mayo de 2008 y mayo de 2014. Esta copia guarda {rows} filas: el
        mundial completo de cada una y las tablas de Japón, Norteamérica,
        Europa y Australia. Se tomó el {formatCopiedAt(catalog.scrapedAt)} para
        que no dependa de que la web original siga en pie.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/buscar"
          className="inline-flex h-12 items-center rounded-full bg-ribbon px-5 font-semibold text-white"
        >
          Buscar un jugador
        </Link>
        <Link
          href="/estadisticas"
          className="inline-flex h-12 items-center rounded-full border border-line bg-card px-5 font-semibold"
        >
          Quién ganó más mundiales
        </Link>
      </div>
      <dl className="mt-8 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-line bg-card px-4 py-3">
          <dt className="text-sm text-ink-soft">Competiciones</dt>
          <dd className="font-serif text-3xl">145</dd>
        </div>
        <div className="rounded-2xl border border-line bg-card px-4 py-3">
          <dt className="text-sm text-ink-soft">Tiempos</dt>
          <dd className="font-serif text-3xl">{rows}</dd>
        </div>
        <div className="rounded-2xl border border-line bg-card px-4 py-3">
          <dt className="text-sm text-ink-soft">Copia</dt>
          <dd className="font-serif text-xl leading-tight sm:text-2xl">
            {formatCopiedAt(catalog.scrapedAt)}
          </dd>
        </div>
      </dl>
      <section className="mt-12">
        <h2 className="font-serif text-3xl">Campeón del mundo de cada una</h2>
        <p className="mt-2 max-w-2xl text-ink-soft">
          El nombre y el tiempo son el mejor registro real de esa competición. Si
          el primer puesto oficial es una marca imposible, aquí aparece quien
          hizo el primer tiempo de verdad. La tabla entera, puesto por puesto,
          está dentro.
        </p>
        <div className="mt-6">
          <CompetitionList competitions={catalog.competitions} />
        </div>
      </section>
    </div>
  );
}
