import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1 className="font-serif text-4xl">Esa competición no está en el archivo</h1>
      <p className="mt-3 text-ink-soft">
        Hubo 145, numeradas del 1 al 145.
      </p>
      <Link href="/" className="mt-6 inline-block font-semibold underline">
        Volver al listado
      </Link>
    </div>
  );
}
