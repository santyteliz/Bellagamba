import type { Metadata } from "next";
import { ListingPage } from "@/components/listing/ListingPage";

export const metadata: Metadata = {
  title: "Alquileres temporarios en Zona Norte",
  description: "Alquileres temporarios en Vicente López y Zona Norte. Contanos qué necesitás y te ayudamos.",
  alternates: { canonical: "/inmobiliaria/temporario" },
};

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await searchParams; // render dinámico: filtros desde la URL en el SSR
  return <ListingPage locked="temporario" />;
}
