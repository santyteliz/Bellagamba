import type { Metadata } from "next";
import { getAllCards } from "@/lib/properties";
import { PageHero } from "@/components/ui/PageHero";
import { FavoritesView } from "@/components/favorites/FavoritesView";

export const metadata: Metadata = {
  title: "Mis favoritos",
  robots: { index: false, follow: true },
  alternates: { canonical: "/inmobiliaria/favoritos" },
};

export default async function Page() {
  const cards = await getAllCards();
  return (
    <>
      <PageHero eyebrow="Favoritos" crumbs={[{ label: "Inicio", href: "/inmobiliaria" }, { label: "Favoritos" }]} lines={["Tus propiedades", <span key="b" className="text-naranja-ink">guardadas.</span>]} />
      <FavoritesView cards={cards} />
    </>
  );
}
