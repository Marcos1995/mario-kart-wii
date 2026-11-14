import { catalog } from "@/lib/archive";
import { formatCopiedAt } from "@/lib/names";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm leading-6 text-ink-soft sm:px-6">
        <p>
          Copia de conservación del {formatCopiedAt(catalog.scrapedAt)}, tomada
          de{" "}
          <a className="underline" href={catalog.source}>
            ninrankings.org
          </a>
          . Las tablas las publicó Nintendo en el Canal Mario Kart. Sus
          servidores cerraron el 20 de mayo de 2014. El circuito y las reglas
          de cada prueba están resumidos a partir de la{" "}
          <a className="underline" href={catalog.wiki}>
            Super Mario Wiki
          </a>
          .
        </p>
        <p className="mt-3">
          Cada tabla guarda todas las filas que esa web todavía publica. En
          unos mundiales son unos cientos y en otros pasan de mil: allí no hay
          un tope fijo de 1000. Japón, Norteamérica, Europa y Australia
          conservan su propia tabla. Corea no devuelve filas. Un tiempo por
          debajo de cinco segundos se marca como anómalo: el servidor oficial
          aceptó marcas imposibles, como 0:00.001. Esas filas siguen en la
          tabla, en su puesto. El campeón que cuenta en las estadísticas es el
          primer tiempo real.
        </p>
      </div>
    </footer>
  );
}
