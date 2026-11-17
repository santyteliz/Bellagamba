import { NextResponse, type NextRequest } from "next/server";
import data from "@/data/propiedades.json";

/**
 * Compatibilidad con los links que ya mandó el CRM Hunter:
 *   /inmobiliaria/propiedad/{operacion}/{slug}/{id}
 * La ficha se resuelve por id. Si el slug u operación no coinciden → 301 al canónico (conserva ?asesor=…).
 * (Con PROPERTIES_SOURCE=tokko la página hace el mismo redirect como red de seguridad.)
 */
const MAP = new Map<string, { op: string; slug: string }>((data as { id: number; operacion: string; slug: string }[]).map((p) => [String(p.id), { op: p.operacion.toLowerCase(), slug: p.slug }]));

export function middleware(req: NextRequest) {
  const parts = req.nextUrl.pathname.split("/").filter(Boolean); // inmobiliaria, propiedad, op, slug, id
  if (parts.length < 4) return NextResponse.next();
  const id = parts[parts.length - 1];
  const hit = MAP.get(id);
  if (!hit) return NextResponse.next();
  const [, , op, slug] = parts.length === 5 ? parts : [parts[0], parts[1], parts[2], ""];
  if (op === hit.op && slug === hit.slug && parts.length === 5) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = `/inmobiliaria/propiedad/${hit.op}/${hit.slug}/${id}`;
  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: ["/inmobiliaria/propiedad/:path*"],
};
