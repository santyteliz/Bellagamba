import type { Metadata } from "next";
import { ListingPage } from "@/components/listing/ListingPage";

export const metadata: Metadata = {
  title: "Propiedades en Vicente López y Zona Norte",
  description: "Todas las propiedades de Bellagamba: casas, departamentos, PH y terrenos en Vicente López, Olivos, Florida, Martínez, Tigre y Zona Norte. Filtros, mapa y comparador.",
  alternates: { canonical: "/inmobiliaria/propiedades" },
};

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await searchParams;
  return <ListingPage />;
}
