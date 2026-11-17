import "server-only";
import { getAllProperties } from "@/lib/properties";
import { DESARROLLOS } from "@/lib/desarrollos";

/** Link a la ficha real de la unidad cuando existe en la cartera (sin links muertos). */
export async function devHrefs() {
  const all = await getAllProperties();
  return Object.fromEntries(DESARROLLOS.map((d) => [d.slug, d.propiedadId ? all.find((p) => p.id === d.propiedadId)?.href : undefined]));
}
