import type { Property } from "./types";

/** Zonas del Home. `barrios` = valores de `zona` normalizada que suman al conteo (Tigre incluye Rincón de Milberg). */
export const HOME_ZONES = [
  { name: "Vicente López", barrios: ["Vicente López"] },
  { name: "Olivos", barrios: ["Olivos"] },
  { name: "Florida", barrios: ["Florida"] },
  { name: "Martínez", barrios: ["Martínez"] },
  { name: "Tigre", barrios: ["Tigre", "Rincón de Milberg"] },
];

export function buildZones(all: Property[]) {
  return HOME_ZONES.map((z) => {
    const props = all.filter((p) => z.barrios.includes(p.zona));
    const pick = props.find((p) => p.destacada) ?? props[0];
    return {
      name: z.name,
      count: props.length,
      href: `/inmobiliaria/propiedades?barrio=${z.barrios.map(encodeURIComponent).join(",")}`,
      img: pick?.foto_portada ?? "/propiedades/14338622/02.jpg",
      blur: pick ? pick.blur[pick.foto_portada] : undefined,
    };
  });
}

export function facets(all: Property[]) {
  const z = new Map<string, number>();
  const t = new Map<string, number>();
  for (const p of all) {
    z.set(p.zona, (z.get(p.zona) ?? 0) + 1);
    t.set(p.tipo, (t.get(p.tipo) ?? 0) + 1);
  }
  const sort = (m: Map<string, number>) => [...m].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  return { zonas: sort(z), tipos: sort(t) };
}
