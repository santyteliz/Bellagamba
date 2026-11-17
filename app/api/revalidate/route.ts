import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Revalidación ISR on-demand. Llamar desde Tokko/Hunter (webhook) o a mano al cambiar la cartera:
 *   POST /api/revalidate?secret=REVALIDATE_SECRET            → todo el sitio
 *   POST /api/revalidate?secret=...&path=/inmobiliaria/venta → una ruta
 */
export async function POST(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret") || req.headers.get("x-revalidate-secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }
  const path = url.searchParams.get("path");
  revalidateTag("properties");
  if (path) revalidatePath(path);
  else revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, revalidated: path ?? "all", at: new Date().toISOString() });
}
