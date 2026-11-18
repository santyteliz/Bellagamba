"use client";
/**
 * Manejo de errores del cliente:
 * - Reporta el error a /api/client-error (queda en los Runtime Logs de Vercel con navegador y URL).
 * - Si es un chunk viejo que ya no existe (pasa cuando hay un deploy nuevo con la pestaña abierta),
 *   recarga la página una sola vez para traer la versión actual.
 */
const CHUNK_RE = /ChunkLoadError|Loading (CSS )?chunk|dynamically imported module|Importing a module script failed|error loading dynamically/i;

export function isChunkError(error: unknown) {
  const e = error as { name?: string; message?: string } | null;
  return CHUNK_RE.test(`${e?.name ?? ""} ${e?.message ?? ""}`);
}

export function reportClientError(error: unknown, source: string) {
  try {
    const e = error as { name?: string; message?: string; stack?: string; digest?: string } | null;
    const body = JSON.stringify({
      source,
      name: e?.name,
      message: String(e?.message ?? error).slice(0, 500),
      stack: String(e?.stack ?? "").slice(0, 2000),
      digest: e?.digest,
      url: window.location.href,
      ua: navigator.userAgent,
    });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/client-error", new Blob([body], { type: "application/json" }));
    else void fetch("/api/client-error", { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } });
  } catch {
    /* noop */
  }
}

/** Recarga una vez por URL ante un chunk faltante. Devuelve true si recargó. */
export function reloadOnceForChunkError(error: unknown) {
  if (!isChunkError(error)) return false;
  try {
    const key = `bg:reload:${window.location.pathname}`;
    if (sessionStorage.getItem(key)) return false;
    sessionStorage.setItem(key, "1");
  } catch {
    /* sin storage: recargamos igual, una vez por carga */
  }
  window.location.reload();
  return true;
}
