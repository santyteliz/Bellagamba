import type { Metadata } from "next";
import { getAllCards } from "@/lib/properties";
import { COMPRADOR, PROPIETARIO } from "@/data/portal-demo";
import { Portal } from "@/components/portal/Portal";

export const metadata: Metadata = {
  title: "Portal de clientes",
  description: "Seguí tu búsqueda o tu publicación con Bellagamba: propiedades seleccionadas, visitas, consultas y mensajes con tu asesor.",
  robots: { index: false, follow: true },
};

export default async function Page() {
  const ids = new Set([...COMPRADOR.seleccionadas, PROPIETARIO.propiedadId]);
  const cards = (await getAllCards()).filter((c) => ids.has(c.id));
  return <Portal cards={cards} />;
}
