/** Filtros puros (cliente y servidor). Sincronizados con la URL. */
import type { Operacion, PropertyCard } from "./types";

export type SortKey = "recientes" | "menor-valor" | "mayor-valor" | "mas-amplios" | "mas-dormitorios";

export const SORTS: { value: SortKey; label: string }[] = [
  { value: "recientes", label: "Recientes" },
  { value: "menor-valor", label: "Menor valor" },
  { value: "mayor-valor", label: "Mayor valor" },
  { value: "mas-amplios", label: "Más amplios (m²)" },
  { value: "mas-dormitorios", label: "Más dormitorios" },
];

export interface Filters {
  operacion: Operacion | null;
  tipos: string[];
  barrios: string[];
  dormitorios: number | null; // mínimo (4 = 4+)
  banos: number | null;
  ambientes: number | null;
  precioMin: number | null;
  precioMax: number | null;
  m2Min: number | null;
  m2Max: number | null;
  features: string[];
  /** bbox "oeste,sur,este,norte" desde "Buscar en esta zona" */
  bbox: [number, number, number, number] | null;
  orden: SortKey;
}

export const EMPTY_FILTERS: Filters = {
  operacion: null,
  tipos: [],
  barrios: [],
  dormitorios: null,
  banos: null,
  ambientes: null,
  precioMin: null,
  precioMax: null,
  m2Min: null,
  m2Max: null,
  features: [],
  bbox: null,
  orden: "recientes",
};

type Params = { get(name: string): string | null };

const num = (v: string | null) => (v && !Number.isNaN(Number(v)) ? Number(v) : null);
const list = (v: string | null) => (v ? v.split(",").map(decodeURIComponent).filter(Boolean) : []);

export function parseFilters(sp: Params, preset?: Partial<Filters>): Filters {
  const bbox = list(sp.get("zona_mapa")).map(Number);
  const op = sp.get("operacion");
  return {
    ...EMPTY_FILTERS,
    ...preset,
    operacion: (op === "venta" || op === "alquiler" || op === "temporario" ? op : preset?.operacion) ?? null,
    tipos: list(sp.get("tipo")),
    barrios: list(sp.get("barrio")),
    dormitorios: num(sp.get("dormitorios")),
    banos: num(sp.get("banos")),
    ambientes: num(sp.get("ambientes")),
    precioMin: num(sp.get("precio_min")),
    precioMax: num(sp.get("precio_max")),
    m2Min: num(sp.get("m2_min")),
    m2Max: num(sp.get("m2_max")),
    features: list(sp.get("caracteristicas")),
    bbox: bbox.length === 4 && bbox.every((n) => !Number.isNaN(n)) ? (bbox as Filters["bbox"]) : null,
    orden: (SORTS.find((s) => s.value === sp.get("orden"))?.value ?? "recientes") as SortKey,
  };
}

/** Serializa a querystring. `lockedOperacion` evita repetir la operación en /venta, /alquiler… */
export function filtersToQuery(f: Filters, lockedOperacion?: Operacion | null) {
  const q = new URLSearchParams();
  if (f.operacion && f.operacion !== lockedOperacion) q.set("operacion", f.operacion);
  if (f.tipos.length) q.set("tipo", f.tipos.join(","));
  if (f.barrios.length) q.set("barrio", f.barrios.join(","));
  if (f.dormitorios) q.set("dormitorios", String(f.dormitorios));
  if (f.banos) q.set("banos", String(f.banos));
  if (f.ambientes) q.set("ambientes", String(f.ambientes));
  if (f.precioMin) q.set("precio_min", String(f.precioMin));
  if (f.precioMax) q.set("precio_max", String(f.precioMax));
  if (f.m2Min) q.set("m2_min", String(f.m2Min));
  if (f.m2Max) q.set("m2_max", String(f.m2Max));
  if (f.features.length) q.set("caracteristicas", f.features.join(","));
  if (f.bbox) q.set("zona_mapa", f.bbox.map((n) => n.toFixed(4)).join(","));
  if (f.orden !== "recientes") q.set("orden", f.orden);
  return q.toString();
}

type Omit1 = keyof Omit<Filters, "orden">;

function matches(p: PropertyCard, f: Filters, skip?: Omit1) {
  if (skip !== "operacion" && f.operacion && p.operacion !== f.operacion) return false;
  if (skip !== "tipos" && f.tipos.length && !f.tipos.includes(p.tipo)) return false;
  if (skip !== "barrios" && f.barrios.length && !f.barrios.includes(p.zona)) return false;
  if (skip !== "dormitorios" && f.dormitorios && (p.dormitorios ?? 0) < f.dormitorios) return false;
  if (skip !== "banos" && f.banos && (p.banos ?? 0) < f.banos) return false;
  if (skip !== "ambientes" && f.ambientes && (p.ambientes ?? 0) < f.ambientes) return false;
  if (skip !== "precioMin" && f.precioMin && (p.precio ?? 0) < f.precioMin) return false;
  if (skip !== "precioMax" && f.precioMax && (p.precio ?? Infinity) > f.precioMax) return false;
  if (skip !== "m2Min" && f.m2Min && (p.m2 ?? 0) < f.m2Min) return false;
  if (skip !== "m2Max" && f.m2Max && (p.m2 ?? Infinity) > f.m2Max) return false;
  if (skip !== "features" && f.features.length && !f.features.every((k) => p.features.some((x) => x.key === k))) return false;
  if (skip !== "bbox" && f.bbox) {
    const [w, s, e, n] = f.bbox;
    if (p.lat_aprox == null || p.lng_aprox == null) return false;
    if (p.lng_aprox < w || p.lng_aprox > e || p.lat_aprox < s || p.lat_aprox > n) return false;
  }
  return true;
}

export function applyFilters(items: PropertyCard[], f: Filters) {
  const res = items.filter((p) => matches(p, f));
  const by = {
    recientes: (a: PropertyCard, b: PropertyCard) => b.orden - a.orden,
    "menor-valor": (a: PropertyCard, b: PropertyCard) => (a.precio ?? Infinity) - (b.precio ?? Infinity),
    "mayor-valor": (a: PropertyCard, b: PropertyCard) => (b.precio ?? 0) - (a.precio ?? 0),
    "mas-amplios": (a: PropertyCard, b: PropertyCard) => (b.m2 ?? 0) - (a.m2 ?? 0),
    "mas-dormitorios": (a: PropertyCard, b: PropertyCard) => (b.dormitorios ?? 0) - (a.dormitorios ?? 0),
  }[f.orden];
  return res.sort(by);
}

/** Facetas con contador (cada faceta ignora su propio filtro, estilo e-commerce) */
export function facetCounts(items: PropertyCard[], f: Filters) {
  const count = (skip: Omit1, key: (p: PropertyCard) => string[]) => {
    const m = new Map<string, number>();
    for (const p of items) if (matches(p, f, skip)) for (const k of key(p)) m.set(k, (m.get(k) ?? 0) + 1);
    return m;
  };
  return {
    tipos: count("tipos", (p) => [p.tipo]),
    barrios: count("barrios", (p) => [p.zona]),
    features: count("features", (p) => p.features.map((x) => x.key)),
  };
}

export function activeFilterCount(f: Filters, lockedOperacion?: Operacion | null) {
  let n = 0;
  if (f.operacion && f.operacion !== lockedOperacion) n++;
  n += f.tipos.length + f.barrios.length + f.features.length;
  if (f.dormitorios) n++;
  if (f.banos) n++;
  if (f.ambientes) n++;
  if (f.precioMin || f.precioMax) n++;
  if (f.m2Min || f.m2Max) n++;
  if (f.bbox) n++;
  return n;
}

export const OPERACION_LABEL: Record<Operacion, string> = { venta: "Venta", alquiler: "Alquiler", temporario: "Temporario" };
export const OPERACION_EN: Record<Operacion, string> = { venta: "en venta", alquiler: "en alquiler", temporario: "en alquiler temporario" };
