import type { Metadata } from "next";
import { getAllProperties } from "@/lib/properties";
import { facets } from "@/lib/properties/zones";
import { PageHero } from "@/components/ui/PageHero";
import { BusquedaForm } from "@/components/forms/BusquedaForm";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Búsqueda personalizada: buscamos la propiedad por vos",
  description: "Contanos qué estás buscando y lo buscamos por vos en Vicente López y Zona Norte, incluso entre propiedades que todavía no se publicaron.",
  alternates: { canonical: "/inmobiliaria/busqueda-personalizada" },
};

const ZONA_NORTE = ["Vicente López", "Olivos", "Florida", "Munro", "La Lucila", "Martínez", "San Isidro", "Acassuso", "Beccar", "Tigre", "Nordelta", "Núñez", "Belgrano"];

export default async function Page() {
  const all = await getAllProperties();
  const { zonas } = facets(all);
  const options = Array.from(new Set([...ZONA_NORTE, ...zonas.map((z) => z.name)]));
  const steps = [
    ["search", "Nos contás qué buscás", "Tipo, zona, ambientes y presupuesto. Dos minutos."],
    ["user", "Un asesor toma tu búsqueda", "Revisamos nuestra cartera y la red de colegas, incluso lo que aún no se publicó."],
    ["bell", "Te avisamos primero", "Cuando aparece algo que coincide, te escribimos antes que a nadie."],
  ];
  return (
    <>
      <PageHero
        eyebrow="Búsqueda personalizada"
        crumbs={[{ label: "Inicio", href: "/inmobiliaria" }, { label: "Búsqueda personalizada" }]}
        lines={["Buscamos la propiedad", <span key="b" className="text-naranja-ink">por vos.</span>]}
        intro="Incluso las que todavía no se publicaron. Contanos qué necesitás y un asesor de Bellagamba se ocupa del resto."
      />
      <section className="container-x grid gap-14 pb-28 lg:grid-cols-12">
        <ol className="space-y-3 lg:col-span-4">
          {steps.map(([icon, t, d], i) => (
            <Reveal as="li" kind="fade" delay={i * 80} key={t} className="flex gap-4 rounded-2xl bg-white p-5 ring-1 ring-ink/5">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-naranja text-ink">
                <Icon name={icon} size={18} />
              </span>
              <div>
                <p className="font-semibold">{t}</p>
                <p className="mt-1 text-sm text-gris-text">{d}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        <div className="lg:col-span-7 lg:col-start-6">
          <div className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-ink/5 sm:p-10">
            <BusquedaForm zonas={options} />
          </div>
        </div>
      </section>
    </>
  );
}
