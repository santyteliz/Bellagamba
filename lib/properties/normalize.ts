import blurMap from "@/data/blur.json";
import type { Feature, Operacion, Property, PropertyCard, RawProperty } from "./types";

const BLUR = blurMap as Record<string, string>;

/** Características derivadas del texto real de la ficha + amenities. Nada inventado: si no se menciona, no aparece. */
const FEATURE_RULES: { key: string; label: string; test: (t: string, p: RawProperty) => boolean }[] = [
  { key: "pileta", label: "Pileta", test: (t) => /\b(pileta|piscina)\b/.test(t) },
  { key: "jardin", label: "Jardín", test: (t) => /\b(jard[ií]n|parque)\b/.test(t) },
  { key: "cochera", label: "Cochera", test: (t) => /\b(cochera|cocheras|garage|garaje)\b/.test(t) },
  { key: "balcon", label: "Balcón", test: (t, p) => /\bbalc[oó]n\b/.test(t) || p.amenities_servicios.includes("Balcón") },
  { key: "terraza", label: "Terraza", test: (t, p) => /\bterraza\b/.test(t) || p.amenities_servicios.includes("Terraza") },
  { key: "parrilla", label: "Parrilla", test: (t) => /\bparrilla\b/.test(t) },
  { key: "patio", label: "Patio", test: (t) => /\bpatio\b/.test(t) },
  { key: "quincho", label: "Quincho", test: (t) => /\bquincho\b/.test(t) },
  { key: "sum", label: "SUM", test: (t) => /\bs\.?u\.?m\.?\b/.test(t) },
  { key: "gimnasio", label: "Gimnasio", test: (t) => /\b(gimnasio|gym)\b/.test(t) },
  { key: "laundry", label: "Laundry", test: (t) => /\blaundry\b/.test(t) },
  { key: "seguridad", label: "Seguridad", test: (t) => /\b(seguridad|vigilancia)\b/.test(t) },
  { key: "apto-credito", label: "Apto crédito", test: (t) => /apto cr[eé]dito/.test(t) },
  { key: "apto-profesional", label: "Apto profesional", test: (t) => /apto profesional/.test(t) },
  { key: "a-estrenar", label: "A estrenar", test: (t, p) => /estrenar/i.test(p.antiguedad || "") || /\ba estrenar\b/.test(t) },
];

export const FEATURE_LABELS: Record<string, string> = Object.fromEntries(FEATURE_RULES.map((r) => [r.key, r.label]));

function deriveFeatures(p: RawProperty): Feature[] {
  const text = `${p.titulo} ${p.titulo_original || ""} ${p.descripcion}`.toLowerCase();
  return FEATURE_RULES.filter((r) => r.test(text, p)).map(({ key, label }) => ({ key, label }));
}

/** El export de la web vieja pega oraciones ("PremiumCOCHERA", "LópezUbicación"). Separamos en párrafos legibles. */
export function toParagraphs(desc: string): string[] {
  let t = desc
    .replace(/\*\*?Las medidas y superficies[\s\S]*$/i, "")
    .replace(/CUCICBA[\s\S]*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
  t = t
    .replace(/\s*•\s*/g, "\n• ")
    .replace(/([a-záéíóúñ.!?)])(?=[A-ZÁÉÍÓÚÑ]{2,}\b|[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,})/g, "$1\n")
    .replace(/([.!?])\s+(?=[A-ZÁÉÍÓÚÑ¡¿])/g, "$1\n");
  const sentences = t.split("\n").map((s) => s.trim()).filter(Boolean);
  // Reagrupamos oraciones en párrafos de ~3 frases, bullets en su propio bloque
  const out: string[] = [];
  let buf: string[] = [];
  for (const s of sentences) {
    if (s.startsWith("•")) {
      if (buf.length) out.push(buf.join(" ")), (buf = []);
      out.push(s);
      continue;
    }
    buf.push(s);
    if (buf.length >= 3 || /:$/.test(s) === false && s.length > 260) out.push(buf.join(" ")), (buf = []);
  }
  if (buf.length) out.push(buf.join(" "));
  return out;
}

function normalizeOperacion(op: string): Operacion {
  const o = op.toLowerCase();
  if (o.startsWith("alq")) return "alquiler";
  if (o.startsWith("temp")) return "temporario";
  return "venta";
}

const ORIENTACIONES = /^(norte|sur|este|oeste|noreste|noroeste|sureste|suroeste|n|s|e|o|ne|no|se|so)$/i;

export function propertyHref(p: { operacion: string; slug: string; id: number }) {
  return `/inmobiliaria/propiedad/${p.operacion}/${p.slug}/${p.id}`;
}

/** Imágenes del export que son planos (revisadas a mano): van a la pestaña "Planos", no a la galería. */
const PLANOS_DETECTADOS: Record<number, string[]> = {
  13113629: ["06.jpg"],
  12042203: ["06.jpg", "20.jpg"],
};

export function normalize(raw: RawProperty, index: number): Property {
  const planosExtra = (PLANOS_DETECTADOS[raw.id] ?? []).map((f) => `/propiedades/${raw.id}/${f}`);
  const p: RawProperty = planosExtra.length ? { ...raw, fotos: raw.fotos.filter((f) => !planosExtra.includes(f)), planos: [...(raw.planos ?? []), ...planosExtra] } : raw;
  const operacion = normalizeOperacion(p.operacion);
  const zona = p.barrio.replace(/\s+Mitre\/Este$/i, "").trim();
  const text = `${p.titulo_original || ""} ${p.descripcion}`;
  const features = deriveFeatures(p);
  const m2_totales = p.m2_totales && p.m2_totales > 0 ? p.m2_totales : null;
  const m2_cubiertos = p.m2_cubiertos && p.m2_cubiertos > 0 ? p.m2_cubiertos : null;
  const blur: Record<string, string> = {};
  for (const f of [...p.fotos, ...(p.planos ?? [])]) if (BLUR[f]) blur[f] = BLUR[f];
  return {
    ...p,
    operacion,
    zona,
    m2_totales,
    m2_cubiertos,
    m2: m2_totales ?? m2_cubiertos,
    orientacion: p.orientacion && ORIENTACIONES.test(p.orientacion.trim()) ? p.orientacion.trim() : null,
    estado: /propiedad reservada|\breservad[oa]\b/i.test(text) ? "reservada" : "disponible",
    features,
    aptoCredito: features.some((f) => f.key === "apto-credito"),
    aEstrenar: features.some((f) => f.key === "a-estrenar"),
    parrafos: toParagraphs(p.descripcion || ""),
    href: propertyHref({ operacion, slug: p.slug, id: p.id }),
    blur,
    videos: p.videos ?? [],
    planos: p.planos ?? [],
    tour360: p.tour360 ?? null,
    orden: p.id || index,
  };
}

/** Card liviana: solo 6 fotos para el mini carrusel */
export function toCard(p: Property): PropertyCard {
  const fotos = p.fotos.slice(0, 6);
  const blur: Record<string, string> = {};
  for (const f of fotos) if (p.blur[f]) blur[f] = p.blur[f];
  return {
    id: p.id,
    slug: p.slug,
    operacion: p.operacion,
    titulo: p.titulo,
    tipo: p.tipo,
    direccion: p.direccion,
    barrio: p.barrio,
    zona: p.zona,
    localidad: p.localidad,
    precio: p.precio,
    moneda: p.moneda,
    ambientes: p.ambientes,
    dormitorios: p.dormitorios,
    banos: p.banos,
    m2: p.m2,
    m2_totales: p.m2_totales,
    m2_cubiertos: p.m2_cubiertos,
    destacada: p.destacada,
    estado: p.estado,
    features: p.features,
    aptoCredito: p.aptoCredito,
    aEstrenar: p.aEstrenar,
    href: p.href,
    lat_aprox: p.lat_aprox,
    lng_aprox: p.lng_aprox,
    foto_portada: p.foto_portada,
    orden: p.orden,
    fotos,
    blur,
  };
}
