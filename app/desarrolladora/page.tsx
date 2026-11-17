import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import { DESARROLLOS } from "@/lib/desarrollos";
import { devHrefs } from "@/lib/desarrollosHrefs";
import { DevGrid } from "@/components/desarrollos/DevGrid";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ShulbiusMark } from "@/components/ui/Logo";
import { ContactForm } from "@/components/forms/ContactForm";
import { Marquee } from "@/components/ui/Marquee";
import { SITE, yearsSince } from "@/lib/site";

export const metadata: Metadata = {
  title: "Desarrolladora · Calidad que trasciende",
  description: "Bellagamba Desarrolladora y la marca Shulbius: desarrollos premium en Vicente López. Terrenos con visión: detectamos oportunidades donde otros solo ven tierra.",
  alternates: { canonical: "/desarrolladora" },
};

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
const li = (i: number) => ({ "--i": i }) as CSSProperties;

export default async function Page() {
  const hrefs = await devHrefs();
  return (
    <div className="on-dark bg-ink text-white">
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
        <Image src="/propiedades/13113629/01.jpg" alt="Shulbius Kite, rooftop" fill priority sizes="100vw" className="-z-10 object-cover opacity-55" style={{ animation: "kenburns 16s ease-out both" }} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
        <div className="container-x pb-20 pt-40">
          <ShulbiusMark className="hero-fade h-14 w-auto text-naranja" />
          <p className="hero-fade mt-8 text-[12px] uppercase tracking-shulbius text-white/80" style={d(150)}>
            Bellagamba · Desarrolladora
          </p>
          <h1 className="hero-title mt-6 max-w-5xl text-display font-light">
            <span className="rl" style={li(0)}>
              <span>Calidad</span>
            </span>
            <span className="rl" style={li(1)}>
              <span className="text-naranja">que trasciende.</span>
            </span>
          </h1>
          <div className="hero-fade mt-10 flex flex-wrap gap-3" style={d(600)}>
            <ButtonLink href="/desarrolladora/desarrollos" size="lg" arrow>
              Ver desarrollos
            </ButtonLink>
            <ButtonLink href="/desarrolladora/shulbius" variant="outline-light" size="lg">
              Shulbius
            </ButtonLink>
          </div>
        </div>
      </section>

      <div className="border-y border-white/10 py-6" aria-hidden="true">
        <Marquee duration={40}>
          {["Kite", "Mill3", "Drei", "Emme", "Doc", "Dream"].map((n) => (
            <span key={n} className="flex items-center gap-10 px-5 text-2xl font-light uppercase tracking-shulbius text-white/80">
              Shulbius {n} <span className="size-1.5 rounded-full bg-naranja" />
            </span>
          ))}
        </Marquee>
      </div>

      <section className="py-24 lg:py-40">
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-[12px] uppercase tracking-shulbius text-naranja">Terrenos con visión</p>
            <RevealLines className="mt-6 text-h1 font-light" lines={["Detectamos oportunidades", <span key="b" className="text-white/60">donde otros solo ven tierra.</span>]} />
          </div>
          <Reveal kind="fade" className="space-y-6 text-lg leading-relaxed text-white/70">
            <p>Más de {yearsSince()} años en el mercado de Zona Norte nos dan algo que no se improvisa: saber dónde construir, qué construir y para quién.</p>
            <p>¿Tenés un terreno? Lo analizamos con nuestro equipo y te proponemos alternativas de compra, permuta o desarrollo conjunto.</p>
            <ButtonLink href="#contacto-desarrolladora" variant="outline-light" arrow>
              Ofrecer un terreno
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 lg:pb-40" aria-labelledby="etapas-t">
        <div className="container-x">
          <p className="text-[12px] uppercase tracking-shulbius text-white/70">Desarrollos</p>
          <RevealLines id="etapas-t" className="mb-12 mt-6 text-h2 font-light" lines={["En pozo, en obra", <span key="b" className="text-naranja">y terminados.</span>]} />
          <DevGrid items={DESARROLLOS} hrefs={hrefs} dark />
        </div>
      </section>

      <section id="contacto-desarrolladora" className="scroll-mt-24 border-t border-white/10 py-24 lg:py-36">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-[12px] uppercase tracking-shulbius text-naranja">Contacto</p>
            <RevealLines className="mt-6 text-h2 font-light" lines={["¿Ya conocés nuestros desarrollos?", <span key="b" className="text-naranja">Sé parte y descubrilos.</span>]} />
            <p className="mt-6 text-white/70">
              {SITE.address.street}, {SITE.address.city} · Tel. {SITE.phone} · {SITE.email}
            </p>
          </div>
          <div className="rounded-[var(--radius-card)] bg-crema p-6 text-ink sm:p-10 lg:col-span-6 lg:col-start-7">
            <ContactForm defaultAsunto="Consulta general" />
          </div>
        </div>
      </section>
    </div>
  );
}
