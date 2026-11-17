import "server-only";
import { slugify } from "@/lib/format";
import type { PropertyAdapter, RawProperty } from "./types";

/**
 * Adapter Tokko Broker (listo para conectar).
 * - La API key vive SOLO en el servidor: process.env.TOKKO_API_KEY (nunca NEXT_PUBLIC_).
 * - Activar con PROPERTIES_SOURCE=tokko.
 * - Las fotos se sirven desde el CDN de Tokko (agregar el host a images.remotePatterns en next.config.ts).
 * Docs: https://www.tokkobroker.com/api/playground
 */
const BASE = "https://www.tokkobroker.com/api/v1";

interface TokkoProperty {
  id: number;
  publication_title: string;
  address: string;
  fake_address?: string;
  real_address?: string;
  description: string;
  type: { name: string };
  location: { name: string; full_location: string; short_location?: string };
  operations: { operation_type: string; prices: { price: number; currency: string }[] }[];
  room_amount: number;
  suite_amount: number;
  bathroom_amount: number;
  parking_lot_amount: number;
  expenses: number;
  total_surface: string;
  roofed_surface: string;
  age: number;
  orientation?: string;
  is_starred_on_web: boolean;
  geo_lat: string;
  geo_long: string;
  photos: { image: string; is_blueprint: boolean; order: number }[];
  videos: { player_url: string }[];
  tags: { name: string; type: number }[];
  public_url?: string;
  status?: number;
  reference_code?: string;
}

const OP_MAP: Record<string, string> = { Venta: "venta", Alquiler: "alquiler", "Alquiler temporario": "temporario" };

function map(t: TokkoProperty): RawProperty {
  const op = t.operations?.[0];
  const price = op?.prices?.[0];
  const photos = [...(t.photos || [])].sort((a, b) => a.order - b.order);
  const fotos = photos.filter((p) => !p.is_blueprint).map((p) => p.image);
  const parts = (t.location?.full_location || "").split("|").map((s) => s.trim());
  const operacion = OP_MAP[op?.operation_type || "Venta"] || "venta";
  const direccion = t.fake_address || t.address;
  return {
    id: t.id,
    slug: slugify(direccion),
    operacion,
    titulo: t.publication_title,
    titulo_original: t.publication_title,
    tipo: t.type?.name,
    direccion,
    direccion_completa: t.address,
    barrio: t.location?.name,
    localidad: parts.at(-2) || "",
    precio: price?.price ?? null,
    moneda: price?.currency || "USD",
    ambientes: t.room_amount || null,
    dormitorios: t.suite_amount || null,
    banos: t.bathroom_amount || null,
    cocheras: t.parking_lot_amount || null,
    expensas: t.expenses || null,
    m2_totales: Number(t.total_surface) || null,
    m2_cubiertos: Number(t.roofed_surface) || null,
    antiguedad: t.age === 0 ? "A estrenar" : t.age ? `${t.age} años` : null,
    orientacion: t.orientation || null,
    amenities_servicios: (t.tags || []).map((x) => x.name),
    descripcion: t.description,
    destacada: !!t.is_starred_on_web,
    fotos,
    foto_portada: fotos[0],
    lat_aprox: Number(t.geo_lat) || null,
    lng_aprox: Number(t.geo_long) || null,
    videos: (t.videos || []).map((v) => v.player_url),
    planos: photos.filter((p) => p.is_blueprint).map((p) => p.image),
    tour360: null,
  };
}

export const tokkoAdapter: PropertyAdapter = {
  name: "tokko",
  async getAll() {
    const key = process.env.TOKKO_API_KEY;
    if (!key) throw new Error("TOKKO_API_KEY no configurada");
    const out: RawProperty[] = [];
    let url: string | null = `${BASE}/property/?format=json&lang=es_ar&limit=50&key=${key}`;
    while (url) {
      const res: Response = await fetch(url, { next: { revalidate: 3600, tags: ["properties"] } });
      if (!res.ok) throw new Error(`Tokko ${res.status}`);
      const json = (await res.json()) as { objects: TokkoProperty[]; meta: { next: string | null } };
      out.push(...json.objects.map(map));
      url = json.meta.next ? `https://www.tokkobroker.com${json.meta.next}` : null;
    }
    return out;
  },
};
