import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { permanentRedirect } from "next/navigation";
import { getAllProperties, getPropertyById, getSimilar } from "@/lib/properties";
import { formatM2, formatPrice } from "@/lib/format";
import { OPERACION_LABEL } from "@/lib/properties/filters";
import { SITE } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";
import { Gallery } from "@/components/ficha/Gallery";
import { FichaActions } from "@/components/ficha/FichaActions";
import { PricePanel, MobileStickyBar } from "@/components/ficha/PricePanel";
import { ContactPanel } from "@/components/ficha/ContactPanel";
import { Description } from "@/components/ficha/Description";
import { MortgageCalculator } from "@/components/ficha/MortgageCalculator";
import { ViewTracker } from "@/components/ficha/ViewTracker";
import { Unavailable } from "@/components/ficha/Unavailable";
import { LazyMap } from "@/components/map/LazyMap";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { WhatsAppMessage } from "@/components/layout/WhatsAppFloat";
import { Reveal } from "@/components/ui/Reveal";

export const revalidate = 3600;
export const dynamicParams = true;

type Params = Promise<{ operacion: string; slug: string; id: string }>;

export async function generateStaticParams() {
  const all = await getAllProperties();
  return all.map((p) => ({ operacion: p.operacion, slug: p.slug, id: String(p.id) }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const p = await getPropertyById(Number(id));
  if (!p) return { title: "Propiedad no disponible", robots: { index: false } };
  const facts = [p.ambientes && `${p.ambientes} amb.`, p.dormitorios && `${p.dormitorios} dorm.`, formatM2(p.m2)].filter(Boolean).join(" · ");
  const title = `${p.titulo} · ${formatPrice(p.precio, p.moneda)}`;
  const description = `${p.tipo} en ${p.operacion} en ${p.barrio}${facts ? ` · ${facts}` : ""}. ${p.parrafos[0]?.slice(0, 120) ?? ""}`.trim();
  return {
    title,
    description,
    alternates: { canonical: p.href },
    openGraph: { title, description, url: p.href, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function FichaPage({ params }: { params: Params }) {
  const { operacion, slug, id } = await params;
  const p = await getPropertyById(Number(id));

  if (!p) {
    const all = await getAllProperties();
    // Buscamos similares por pistas del slug (barrio) para no dejar al cliente en blanco
    const hint = all.find((x) => slug.includes(x.zona.toLowerCase().replace(/\s+/g, "-"))) ?? all[0];
    const similares = await getSimilar({ ...hint, id: -1 }, 6);
    return <Unavailable similares={similares} id={id} />;
  }
  // Slug u operación desactualizados (links viejos del CRM): el middleware ya hace 301; esto es red de seguridad.
  if (p.slug !== slug || p.operacion !== operacion) permanentRedirect(p.href);

  const similares = await getSimilar(p, 3);
  const panelData = { id: p.id, titulo: p.titulo, precio: p.precio, moneda: p.moneda, href: p.href, estado: p.estado, operacion: p.operacion, barrio: p.barrio };

  const facts = [
    { icon: "rooms", label: "Ambientes", value: p.ambientes },
    { icon: "bed", label: "Dormitorios", value: p.dormitorios },
    { icon: "bath", label: "Baños", value: p.banos },
    { icon: "car", label: "Cocheras", value: p.cocheras },
    { icon: "area", label: "Sup. total", value: formatM2(p.m2_totales) },
    { icon: "area", label: "Sup. cubierta", value: formatM2(p.m2_cubiertos) },
    { icon: "calendar", label: "Antigüedad", value: p.antiguedad },
    { icon: "compass", label: "Orientación", value: p.orientacion },
    { icon: "coin", label: "Expensas", value: p.expensas ? formatPrice(p.expensas, "$") : null },
  ].filter((f) => f.value != null && f.value !== "");

  const chips = Array.from(new Set([...p.features.map((f) => f.label), ...p.amenities_servicios]));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.titulo,
    description: p.parrafos.join(" ").slice(0, 500),
    url: `${SITE.url}${p.href}`,
    image: p.fotos.slice(0, 6).map((f) => `${SITE.url}${f}`),
    datePosted: undefined,
    offers: { "@type": "Offer", price: p.precio ?? undefined, priceCurrency: p.moneda, availability: p.estado === "reservada" ? "https://schema.org/LimitedAvailability" : "https://schema.org/InStock", businessFunction: p.operacion === "venta" ? "http://purl.org/goodrelations/v1#Sell" : "http://purl.org/goodrelations/v1#LeaseOut" },
    about: {
      "@type": p.tipo === "Departamento" ? "Apartment" : p.tipo === "Casa" ? "SingleFamilyResidence" : "Accommodation",
      numberOfRooms: p.ambientes ?? undefined,
      numberOfBedrooms: p.dormitorios ?? undefined,
      numberOfBathroomsTotal: p.banos ?? undefined,
      floorSize: p.m2 ? { "@type": "QuantitativeValue", value: p.m2, unitCode: "MTK" } : undefined,
      address: { "@type": "PostalAddress", streetAddress: p.direccion, addressLocality: p.barrio, addressRegion: p.localidad, addressCountry: "AR" },
      geo: p.lat_aprox ? { "@type": "GeoCoordinates", latitude: p.lat_aprox, longitude: p.lng_aprox } : undefined,
    },
    provider: { "@type": "RealEstateAgent", name: SITE.legalName, telephone: "+54 11 4797-5880", url: SITE.url },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inmobiliaria", item: `${SITE.url}/inmobiliaria` },
      { "@type": "ListItem", position: 2, name: OPERACION_LABEL[p.operacion], item: `${SITE.url}/inmobiliaria/${p.operacion}` },
      { "@type": "ListItem", position: 3, name: p.titulo, item: `${SITE.url}${p.href}` },
    ],
  };

  return (
    <article className="pb-28 pt-20 lg:pb-0 lg:pt-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <ViewTracker id={p.id} titulo={p.titulo} precio={p.precio} />
      <WhatsAppMessage message={`Hola Bellagamba! Me interesa la propiedad "${p.titulo}" (${formatPrice(p.precio, p.moneda)}). ${SITE.url}${p.href}`} />

      <div className="container-x">
        <nav aria-label="Migas de pan" className="mb-4 hidden text-[13px] text-gris-text md:block">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/inmobiliaria" className="hover:text-ink">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/inmobiliaria/${p.operacion}`} className="hover:text-ink">
                {OPERACION_LABEL[p.operacion]}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/inmobiliaria/${p.operacion}?barrio=${encodeURIComponent(p.zona)}`} className="hover:text-ink">
                {p.zona}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="truncate text-ink">
              {p.direccion}
            </li>
          </ol>
        </nav>

        <Gallery fotos={p.fotos} blur={p.blur} title={p.titulo} videos={p.videos} planos={p.planos} tour360={p.tour360} />

        <div className="mt-8 grid gap-12 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_400px]">
          <div className="min-w-0">
            {/* Encabezado */}
            <header>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-ink px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white">{OPERACION_LABEL[p.operacion]}</span>
                <span className="rounded-full border border-ink/12 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em]">{p.tipo}</span>
                {p.estado === "reservada" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-naranja-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-naranja-text">
                    <span className="size-2 rounded-full bg-naranja" /> Reservada
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] ring-1 ring-ink/10">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-verde opacity-60" />
                      <span className="relative inline-flex size-2 rounded-full bg-verde" />
                    </span>
                    Disponible
                  </span>
                )}
                {p.aptoCredito && <span className="rounded-full bg-naranja px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ink">Apto crédito</span>}
              </div>
              <h1 className="mt-5 text-[clamp(1.9rem,1.3rem+2.4vw,3.4rem)] font-light leading-[1.05] tracking-[-0.03em]">{p.titulo}</h1>
              <p className="mt-4 flex items-start gap-2 text-[15px] text-gris-text">
                <Icon name="pin" size={18} className="mt-0.5 shrink-0 text-naranja-text" />
                <span>
                  {p.direccion} · <strong className="font-semibold text-ink">{p.barrio}</strong>, {p.localidad}
                </span>
              </p>
              <p className="mt-6 text-[1.75rem] font-semibold tracking-tight tabular-nums lg:hidden">{formatPrice(p.precio, p.moneda)}</p>
              <div className="mt-6">
                <FichaActions p={panelData} />
              </div>
            </header>

            {/* Datos clave */}
            <section aria-labelledby="datos-t" className="mt-12 border-t border-ink/10 pt-10">
              <h2 id="datos-t" className="eyebrow text-gris-text">
                Datos clave
              </h2>
              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] bg-ink/10 sm:grid-cols-3">
                {facts.map((f) => (
                  <div key={f.label} className="grid grid-cols-[auto_minmax(0,1fr)] grid-rows-2 items-center gap-x-3.5 bg-crema p-4 sm:p-5">
                    <dt className="row-span-2 grid size-11 place-items-center rounded-full bg-white text-ink ring-1 ring-ink/5">
                      <Icon name={f.icon} size={20} />
                      <span className="sr-only">{f.label}</span>
                    </dt>
                    <dd aria-hidden="true" className="self-end text-[12px] leading-tight text-gris-text">
                      {f.label}
                    </dd>
                    <dd className="self-start text-[17px] font-semibold leading-tight [overflow-wrap:anywhere]">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Descripción */}
            <section aria-labelledby="desc-t" className="mt-14">
              <h2 id="desc-t" className="text-h3 font-light">
                Sobre esta propiedad
              </h2>
              <div className="mt-6">
                <Description parrafos={p.parrafos} />
              </div>
            </section>

            {chips.length > 0 && (
              <section aria-labelledby="amen-t" className="mt-14">
                <h2 id="amen-t" className="eyebrow text-gris-text">
                  Características, amenities y servicios
                </h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {chips.map((c) => (
                    <li key={c} className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm">
                      <Icon name="check" size={14} strokeWidth={2} className="text-naranja-text" /> {c}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {p.aptoCredito && p.precio && (
              <div className="mt-14">
                <MortgageCalculator precio={p.precio} moneda={p.moneda} />
              </div>
            )}

            {/* Ubicación aproximada */}
            {p.lat_aprox && p.lng_aprox && (
              <section aria-labelledby="ubic-t" className="mt-14">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <h2 id="ubic-t" className="text-h3 font-light">
                    Ubicación
                  </h2>
                  <p className="text-[13px] text-gris-text">Zona aproximada para resguardar la privacidad del propietario.</p>
                </div>
                <LazyMap
                  circle={{ lat: p.lat_aprox, lng: p.lng_aprox, radius: 320 }}
                  zoom={14.5}
                  ariaLabel={`Mapa de la zona de ${p.barrio}`}
                  className="mt-6 aspect-[4/3] rounded-[var(--radius-card)] sm:aspect-[16/9]"
                />
                <p className="mt-3 text-sm text-gris-text">
                  {p.barrio}, {p.localidad}
                </p>
              </section>
            )}

            <div className="mt-14">
              <Suspense fallback={<div className="skeleton h-96 rounded-[var(--radius-card)]" />}>
                <ContactPanel p={panelData} />
              </Suspense>
            </div>

            <footer className="mt-10 space-y-2 border-t border-ink/10 pt-6 text-[12px] leading-relaxed text-gris-text">
              <p>{SITE.disclaimer}</p>
              <p>
                {SITE.legalName} · Matrículas {SITE.matriculas} · ID {p.id}
              </p>
            </footer>
          </div>

          <aside className="hidden lg:block" aria-label="Precio y contacto">
            <div className="sticky top-24">
              <Suspense fallback={<div className="skeleton h-80 rounded-[var(--radius-card)]" />}>
                <PricePanel p={panelData} />
              </Suspense>
            </div>
          </aside>
        </div>
      </div>

      {similares.length > 0 && (
        <section aria-labelledby="similares-t" className="mt-24 bg-white py-20 lg:mt-32 lg:py-28">
          <div className="container-x">
            <Reveal kind="fade" className="flex flex-wrap items-end justify-between gap-6">
              <h2 id="similares-t" className="text-h2 font-light">
                Propiedades <span className="text-naranja-ink">similares</span>
              </h2>
              <Link href={`/inmobiliaria/${p.operacion}`} className="inline-flex items-center gap-2 text-sm font-semibold hover:text-naranja-text">
                Ver todas <Icon name="arrow" size={16} />
              </Link>
            </Reveal>
            <PropertyGrid items={similares} className="mt-12" />
          </div>
        </section>
      )}

      <Suspense>
        <MobileStickyBar p={panelData} />
      </Suspense>
    </article>
  );
}
