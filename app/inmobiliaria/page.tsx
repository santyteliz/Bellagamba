import type { Metadata } from "next";
import { getAllProperties, toCard } from "@/lib/properties";
import { buildZones, facets } from "@/lib/properties/zones";
import { formatPrice } from "@/lib/format";
import { getGoogleReviews } from "@/lib/reviews";
import { Hero, type HeroSlide } from "@/components/home/Hero";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { Zones, Stats, OrangeBlock, Services, ShulbiusSection, TasacionSection, WhyUs, Testimonials, ContactSection } from "@/components/home/Sections";
import { Marquee } from "@/components/ui/Marquee";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: "Bellagamba Marketing Inmobiliario · Propiedades en Vicente López y Zona Norte" },
  alternates: { canonical: "/inmobiliaria" },
  openGraph: { images: [{ url: "/propiedades/14338622/02.jpg", width: 1600, height: 1200, alt: "Casa en Olivos, Bellagamba" }] },
};

// Hero: casa de Manuel Estrada (14338622) + 2 destacadas, crossfade
const HERO = [
  { id: 14338622, foto: "/propiedades/14338622/02.jpg" },
  { id: 13113629, foto: "/propiedades/13113629/01.jpg" },
  { id: 8697868, foto: "/propiedades/8697868/01.jpg" },
];

export default async function InmobiliariaHome() {
  const [all, reviews] = await Promise.all([getAllProperties(), getGoogleReviews()]);
  const slides: HeroSlide[] = HERO.map(({ id, foto }) => {
    const p = all.find((x) => x.id === id)!;
    return { src: foto, blur: p.blur[foto], caption: `${p.tipo} en ${p.barrio}`, price: formatPrice(p.precio, p.moneda), href: p.href };
  });
  const { zonas, tipos } = facets(all);
  const featured = all.filter((p) => p.destacada).map(toCard);
  const kite = all.find((p) => p.id === 13113629);

  return (
    <>
      <Hero slides={slides} zonas={zonas} tipos={tipos} />
      <FeaturedCarousel items={featured} />
      <div className="overflow-hidden border-y border-ink/10 bg-ink py-5 text-white" aria-hidden="true">
        <Marquee duration={35}>
          {["Vicente López", "Olivos", "Florida", "Martínez", "San Isidro", "Tigre", "Núñez", "Desde 1990"].map((z) => (
            <span key={z} className="flex items-center gap-8 px-4 text-xl font-light tracking-tight sm:text-2xl">
              {z} <span className="size-2 rounded-full bg-naranja" />
            </span>
          ))}
        </Marquee>
      </div>
      <Zones zones={buildZones(all)} />
      <Stats />
      <OrangeBlock />
      <Services />
      <ShulbiusSection kiteHref={kite?.href ?? "/desarrolladora/shulbius"} />
      <TasacionSection />
      <WhyUs />
      <Testimonials reviews={reviews.reviews} rating={reviews.rating} total={reviews.total} />
      <ContactSection />
    </>
  );
}
