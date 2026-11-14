"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Competiciones" },
  { href: "/estadisticas", label: "Quién ganó más" },
  { href: "/buscar", label: "Buscar jugador" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-line bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <Link href="/" className="group">
          <p className="font-serif text-2xl leading-none tracking-tight text-ink">
            Mario Kart Wii
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Archivo de las competiciones oficiales, 2008–2014
          </p>
        </Link>
        <nav className="flex flex-wrap gap-2" aria-label="Secciones">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-semibold",
                  active
                    ? "bg-ink text-paper"
                    : "text-ink-soft hover:bg-paper-deep hover:text-ink",
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
