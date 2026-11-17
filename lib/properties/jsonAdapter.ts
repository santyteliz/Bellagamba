import data from "@/data/propiedades.json";
import type { PropertyAdapter, RawProperty } from "./types";

/** Adapter de demo: lee el export real de la cartera (data/propiedades.json). */
export const jsonAdapter: PropertyAdapter = {
  name: "json",
  async getAll() {
    return data as unknown as RawProperty[];
  },
};
