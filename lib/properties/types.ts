export type Operacion = "venta" | "alquiler" | "temporario";

/** Forma cruda del JSON exportado (y la que debe devolver tokkoAdapter tras mapear) */
export interface RawProperty {
  id: number;
  slug: string;
  operacion: string;
  titulo: string;
  titulo_original?: string;
  tipo: string;
  direccion: string;
  direccion_completa?: string;
  barrio: string;
  localidad: string;
  precio: number | null;
  moneda: string;
  ambientes: number | null;
  dormitorios: number | null;
  banos: number | null;
  cocheras: number | null;
  expensas: number | null;
  m2_totales: number | null;
  m2_cubiertos: number | null;
  antiguedad: string | null;
  orientacion: string | null;
  amenities_servicios: string[];
  descripcion: string;
  destacada: boolean;
  fotos: string[];
  foto_portada: string;
  lat_aprox: number | null;
  lng_aprox: number | null;
  url_actual?: string;
  // Preparados para Tokko (vacíos en la demo)
  videos?: string[];
  planos?: string[];
  tour360?: string | null;
}

export interface Feature {
  key: string;
  label: string;
}

export interface Property extends Omit<RawProperty, "operacion" | "orientacion" | "m2_totales"> {
  operacion: Operacion;
  orientacion: string | null;
  m2_totales: number | null;
  /** Barrio normalizado para filtros ("Florida Mitre/Este" → "Florida") */
  zona: string;
  estado: "disponible" | "reservada";
  features: Feature[];
  aptoCredito: boolean;
  aEstrenar: boolean;
  /** Descripción en párrafos limpios */
  parrafos: string[];
  href: string;
  /** m² para ordenar/filtrar: totales, o cubiertos si no hay totales */
  m2: number | null;
  blur: Record<string, string>;
  videos: string[];
  planos: string[];
  tour360: string | null;
  /** índice de recencia (mayor id Tokko = más reciente) */
  orden: number;
}

/** Versión liviana para listados, cards y mapa (se serializa al cliente) */
export type PropertyCard = Pick<
  Property,
  | "id"
  | "slug"
  | "operacion"
  | "titulo"
  | "tipo"
  | "direccion"
  | "barrio"
  | "zona"
  | "localidad"
  | "precio"
  | "moneda"
  | "ambientes"
  | "dormitorios"
  | "banos"
  | "m2"
  | "m2_totales"
  | "m2_cubiertos"
  | "destacada"
  | "estado"
  | "features"
  | "aptoCredito"
  | "aEstrenar"
  | "href"
  | "lat_aprox"
  | "lng_aprox"
  | "foto_portada"
  | "orden"
> & { fotos: string[]; blur: Record<string, string> };

export interface PropertyAdapter {
  name: string;
  getAll(): Promise<RawProperty[]>;
}
