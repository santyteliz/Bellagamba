"use client";
import { useSearchParams } from "next/navigation";
import { SITE } from "@/lib/site";
import { formatPrice } from "@/lib/format";

/** Asesor que mandó el link desde Hunter: ?asesor=liliana-venegas → "Liliana Venegas" */
export function useAsesor() {
  const sp = useSearchParams();
  const raw = sp.get("asesor");
  if (!raw) return null;
  const name = raw
    .replace(/[-_+.]/g, " ")
    .replace(/[^\p{L}\s]/gu, "")
    .trim()
    .slice(0, 40)
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
  return name || null;
}

export function fichaWhatsAppMessage(p: { titulo: string; precio: number | null; moneda: string; href: string }, asesor: string | null) {
  const url = `${SITE.url}${p.href}`;
  return `Hola${asesor ? ` ${asesor.split(" ")[0]}` : ""}! Me interesa la propiedad "${p.titulo}" (${formatPrice(p.precio, p.moneda)}). ¿Me pasás más información? ${url}`;
}
