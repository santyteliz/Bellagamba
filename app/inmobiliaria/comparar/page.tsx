import type { Metadata } from "next";
import { getAllCards } from "@/lib/properties";
import { PageHero } from "@/components/ui/PageHero";
import { CompareView } from "@/components/favorites/CompareView";

export const metadata: Metadata = {
  title: "Comparar propiedades",
  robots: { index: false, follow: true },
  alternates: { canonical: "/inmobiliaria/comparar" },
};

export default async function Page() {
  const cards = await getAllCards();
  return (
    <>
      <PageHero eyebrow="Comparador" crumbs={[{ label: "Inicio", href: "/inmobiliaria" }, { label: "Comparar" }]} lines={["Compará lado a lado", <span key="b" className="text-naranja-ink">hasta 3 propiedades.</span>]} />
      <CompareView cards={cards} />
    </>
  );
}
