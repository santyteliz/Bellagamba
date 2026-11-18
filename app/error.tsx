"use client";
import { useEffect, useState } from "react";
import { reloadOnceForChunkError, reportClientError } from "@/lib/clientError";
import { waLink } from "@/lib/site";

/** Error de una página: en vez de la pantalla blanca de Next, una salida clara y el detalle técnico. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    reportClientError(error, "error-boundary");
    if (reloadOnceForChunkError(error)) setReloading(true);
  }, [error]);

  if (reloading) return <div className="min-h-[60vh]" aria-busy="true" />;

  return (
    <div className="container-x pb-24 pt-36 lg:pt-44">
      <p className="eyebrow text-naranja-text">Algo salió mal</p>
      <h1 className="mt-5 max-w-3xl text-h2 font-light">No pudimos mostrar esta página.</h1>
      <p className="mt-5 max-w-xl text-gris-text">Probá de nuevo. Si sigue pasando, escribinos por WhatsApp y te mandamos la info al instante.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            reset();
            window.location.reload();
          }}
          className="inline-flex h-12 items-center rounded-full bg-naranja px-6 text-sm font-semibold text-ink"
        >
          Reintentar
        </button>
        <a href="/inmobiliaria" className="inline-flex h-12 items-center rounded-full border border-ink/15 px-6 text-sm font-semibold">
          Ir al inicio
        </a>
        <a
          href={waLink("Hola Bellagamba! Tuve un problema al ver una página de la web.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center rounded-full border border-ink/15 px-6 text-sm font-semibold"
        >
          WhatsApp
        </a>
      </div>
      <p className="mt-12 max-w-xl break-words font-mono text-xs text-gris-text">
        {error.name}: {error.message}
        {error.digest ? ` · ${error.digest}` : ""}
      </p>
    </div>
  );
}
