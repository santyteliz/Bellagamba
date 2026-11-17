import type { MetadataRoute } from "next";
import { getAllProperties } from "@/lib/properties";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

/** sitemap.xml generado desde la cartera (JSON hoy, Tokko mañana) */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const all = await getAllProperties();
  const now = new Date();
  const statics = [
    ["/", 0.6],
    ["/inmobiliaria", 1],
    ["/inmobiliaria/venta", 0.9],
    ["/inmobiliaria/alquiler", 0.7],
    ["/inmobiliaria/temporario", 0.5],
    ["/inmobiliaria/propiedades", 0.9],
    ["/inmobiliaria/emprendimientos", 0.7],
    ["/inmobiliaria/busqueda-personalizada", 0.7],
    ["/inmobiliaria/tasacion", 0.8],
    ["/inmobiliaria/nosotros", 0.6],
    ["/inmobiliaria/contacto", 0.7],
    ["/desarrolladora", 0.7],
    ["/desarrolladora/shulbius", 0.7],
    ["/desarrolladora/desarrollos", 0.6],
    ["/politica-de-privacidad", 0.2],
  ] as const;
  return [
    ...statics.map(([path, priority]) => ({ url: `${SITE.url}${path}`, lastModified: now, changeFrequency: "weekly" as const, priority })),
    ...all.map((p) => ({
      url: `${SITE.url}${p.href}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: p.destacada ? 0.9 : 0.8,
      images: p.fotos.slice(0, 5).map((f) => `${SITE.url}${f}`),
    })),
  ];
}
