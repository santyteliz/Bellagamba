import type { Metadata } from "next";
import { ListingPage } from "@/components/listing/ListingPage";

export const metadata: Metadata = {
  title: "Propiedades en alquiler en Zona Norte",
  description: "Departamentos y casas en alquiler en Vicente López y Zona Norte. Si no encontrás lo que buscás, lo buscamos por vos.",
  alternates: { canonical: "/inmobiliaria/alquiler" },
};

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await searchParams; // render dinámico: filtros desde la URL en el SSR
  return <ListingPage locked="alquiler" />;
}
