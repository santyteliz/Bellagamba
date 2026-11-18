"use client";
import { useEffect } from "react";
import { reloadOnceForChunkError, reportClientError } from "@/lib/clientError";

/** Último recurso: error en el layout raíz. Sin estilos globales, todo inline. */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    reportClientError(error, "global-error");
    reloadOnceForChunkError(error);
  }, [error]);

  return (
    <html lang="es-AR">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f5f3ef", color: "#141414" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "120px 16px" }}>
          <p style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B85000", fontWeight: 700 }}>Algo salió mal</p>
          <h1 style={{ fontWeight: 300, fontSize: 34, lineHeight: 1.15 }}>No pudimos mostrar esta página.</h1>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{ marginTop: 24, height: 48, padding: "0 24px", borderRadius: 999, border: 0, background: "#EF7208", color: "#141414", fontWeight: 600, fontSize: 14 }}
          >
            Reintentar
          </button>
          <p style={{ marginTop: 40, fontFamily: "ui-monospace, monospace", fontSize: 12, color: "#6b6b6b", wordBreak: "break-word" }}>
            {error.name}: {error.message}
            {error.digest ? ` · ${error.digest}` : ""}
          </p>
        </div>
      </body>
    </html>
  );
}
