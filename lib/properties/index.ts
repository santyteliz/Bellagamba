import "server-only";
import { cache } from "react";
import { jsonAdapter } from "./jsonAdapter";
import { normalize, toCard } from "./normalize";
import type { Operacion, Property, PropertyAdapter } from "./types";

export type { Property, PropertyCard, Operacion } from "./types";
export { toCard } from "./normalize";

async function getAdapter(): Promise<PropertyAdapter> {
  if (process.env.PROPERTIES_SOURCE === "tokko") {
    const { tokkoAdapter } = await import("./tokkoAdapter");
    return tokkoAdapter;
  }
  return jsonAdapter;
}

export const getAllProperties = cache(async (): Promise<Property[]> => {
  const adapter = await getAdapter();
  const raw = await adapter.getAll();
  return raw.map(normalize).sort((a, b) => b.orden - a.orden);
});

export async function getPropertyById(id: number) {
  return (await getAllProperties()).find((p) => p.id === id) ?? null;
}

export async function getFeatured() {
  return (await getAllProperties()).filter((p) => p.destacada);
}

export async function getByOperacion(op: Operacion) {
  return (await getAllProperties()).filter((p) => p.operacion === op);
}

/** Similares: mismo tipo, misma zona, rango de precio ±35%. Puntaje simple. */
export async function getSimilar(p: Pick<Property, "id" | "tipo" | "zona" | "localidad" | "precio" | "operacion">, n = 3) {
  const all = await getAllProperties();
  return all
    .filter((x) => x.id !== p.id && x.operacion === p.operacion)
    .map((x) => {
      let s = 0;
      if (x.tipo === p.tipo) s += 3;
      if (x.zona === p.zona) s += 3;
      else if (x.localidad === p.localidad) s += 1.5;
      if (p.precio && x.precio) {
        const r = x.precio / p.precio;
        if (r > 0.65 && r < 1.35) s += 2;
        s -= Math.abs(Math.log(r)) * 0.5;
      }
      return { x, s };
    })
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map(({ x }) => toCard(x));
}

export async function getAllCards() {
  return (await getAllProperties()).map(toCard);
}
