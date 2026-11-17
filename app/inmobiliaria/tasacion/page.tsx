import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { TasacionForm } from "@/components/forms/TasacionForm";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { yearsSince } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tasaciones en Vicente López y Zona Norte",
  description: "Conocé el valor real de tu propiedad: análisis comparativo de mercado, informe profesional y respuesta en 24/48 hs. Especialistas en Zona Norte.",
  alternates: { canonical: "/inmobiliaria/tasacion" },
};

export default function Page() {
  const benefits = [
    ["sliders", "Análisis comparativo de mercado", "Comparamos tu propiedad con operaciones y ofertas reales de la zona."],
    ["file", "Informe profesional", "Un documento claro, con valor sugerido y estrategia de venta o alquiler."],
    ["clock", "Respuesta en 24/48 hs", "Coordinamos la visita y te respondemos rápido."],
    ["pin", "Especialistas en Zona Norte", `Más de ${yearsSince()} años tasando en Vicente López, Olivos, Florida y alrededores.`],
  ];
  return (
    <>
      <PageHero
        eyebrow="Tasaciones"
        crumbs={[{ label: "Inicio", href: "/inmobiliaria" }, { label: "Tasaciones" }]}
        lines={["Conocé el valor real", <span key="b" className="text-naranja-ink">de tu propiedad.</span>]}
        intro="Una buena tasación es el primer paso de una buena operación. La hacemos con datos, oficio y conocimiento del barrio."
        image={{ src: "/propiedades/10503015/01.jpg", alt: "Casa con pileta en Vicente López" }}
      />
      <section className="container-x grid gap-14 py-20 lg:grid-cols-12 lg:py-28">
        <div className="grid gap-3 self-start sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
          {benefits.map(([icon, t, d], i) => (
            <Reveal kind="fade" delay={i * 80} key={t} className="rounded-2xl bg-white p-6 ring-1 ring-ink/5">
              <span className="grid size-11 place-items-center rounded-full bg-crema">
                <Icon name={icon} size={20} />
              </span>
              <p className="mt-5 text-lg font-medium">{t}</p>
              <p className="mt-2 text-sm text-gris-text">{d}</p>
            </Reveal>
          ))}
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <div className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-ink/5 sm:p-10">
            <h2 className="mb-8 text-h3 font-light">Pedí tu tasación</h2>
            <TasacionForm />
          </div>
        </div>
      </section>
    </>
  );
}
