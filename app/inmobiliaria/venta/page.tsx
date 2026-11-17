import type { Metadata } from "next";
import { ListingPage } from "@/components/listing/ListingPage";

export const metadata: Metadata = {
  title: "Propiedades en venta en Vicente López y Zona Norte",
  description: "Casas, departamentos, PH y terrenos en venta en Vicente López, Olivos, Florida, Martínez y Zona Norte. Filtrá por barrio, precio y características.",
  alternates: { canonical: "/inmobiliaria/venta" },
};

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await searchParams; // render dinámico: filtros desde la URL en el SSR
  return <ListingPage locked="venta" />;
}
