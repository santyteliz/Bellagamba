/**
 * Desarrollos. Shulbius Kite y Roca 549 salen de datos reales de la cartera (JSON).
 * El resto de la marca Shulbius (Mill3, Drei, Emme, Doc, Dream) figura en su Instagram pero
 * no hay datos: dirección, etapa, fotos y unidades quedan [CONFIRMAR].
 */
export type Etapa = "en-pozo" | "en-obra" | "terminado";

export interface Desarrollo {
  slug: string;
  nombre: string;
  marca: "Shulbius" | "Bellagamba";
  direccion: string | null;
  barrio: string | null;
  etapa: Etapa | null;
  etapaNota?: string;
  descripcion: string;
  propiedadId?: number; // unidad real en la cartera
  foto?: string;
  confirmar?: boolean;
}

export const ETAPAS: { value: Etapa; label: string }[] = [
  { value: "en-pozo", label: "En pozo" },
  { value: "en-obra", label: "En obra" },
  { value: "terminado", label: "Terminados" },
];

export const DESARROLLOS: Desarrollo[] = [
  {
    slug: "shulbius-kite",
    nombre: "Kite",
    marca: "Shulbius",
    direccion: "Juan Díaz de Solís 2200",
    barrio: "Olivos",
    etapa: "terminado",
    etapaNota: "Unidades a estrenar",
    descripcion: "Edificio de diseño con suites, materiales nobles, rooftop con espejo de agua, solárium y parrilla. Paneles solares, recolección de agua de lluvia y preinstalación para carga de autos eléctricos.",
    propiedadId: 13113629,
    foto: "/propiedades/13113629/01.jpg",
  },
  {
    slug: "roca-549",
    nombre: "Roca 549",
    marca: "Bellagamba",
    direccion: "Roca 549",
    barrio: "Vicente López",
    etapa: "en-obra",
    etapaNota: "Entrega noviembre 2026",
    descripcion: "A una cuadra del río, de Libertador al río. Unidades de 3 ambientes con balcón aterrazado, piso radiante, DVH y piscina con solárium en la última planta. Financiación disponible. [CONFIRMAR si es un desarrollo Shulbius]",
    propiedadId: 12042203,
    foto: "/propiedades/12042203/01.jpg",
    confirmar: true,
  },
  ...["Mill3", "Drei", "Emme", "Doc", "Dream"].map((n) => ({
    slug: `shulbius-${n.toLowerCase()}`,
    nombre: n,
    marca: "Shulbius" as const,
    direccion: null,
    barrio: "Vicente López",
    etapa: null,
    descripcion: "Desarrollo Shulbius en Vicente López. Ubicación, etapa, unidades y renders [CONFIRMAR].",
    confirmar: true,
  })),
];
