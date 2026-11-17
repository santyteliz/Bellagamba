import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Timeline } from "@/components/nosotros/Timeline";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { SITE, waLink, yearsSince } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nosotros: una tradición familiar que se convirtió en liderazgo",
  description: `Bellagamba Marketing Inmobiliario: empresa familiar en Zona Norte desde 1990. Más de ${new Date().getFullYear() - 1990} años de trayectoria, innovación y excelencia.`,
  alternates: { canonical: "/inmobiliaria/nosotros" },
};

const MILESTONES = [
  { year: "1990", title: "La familia Bellagamba arranca en Zona Norte", text: "Nace una inmobiliaria familiar con una idea simple: tratar cada operación como si fuera propia." },
  { year: "[CONFIRMAR]", title: "Crecimiento en Vicente López", text: "La casa central en Gaspar Campos 596 se convierte en referencia del barrio. Más cartera, más equipo, la misma cercanía.", pending: true },
  { year: "[CONFIRMAR]", title: "Nace la Desarrolladora y la marca Shulbius", text: "Del corretaje al desarrollo: detectamos oportunidades donde otros solo ven tierra. Kite, Mill3, Drei, Emme, Doc, Dream.", pending: true },
  { year: "Hoy", title: "Inmobiliaria moderna, 100% dedicada a nuestros clientes", text: `Más de ${yearsSince()} años después combinamos trayectoria con marketing, tecnología y una experiencia exclusiva.` },
];

const TEAM = Array.from({ length: 4 }).map((_, i) => ({ name: "[CONFIRMAR] Nombre y apellido", role: i === 0 ? "[CONFIRMAR] Dirección" : "[CONFIRMAR] Asesor/a inmobiliario/a", email: "[CONFIRMAR]@bellagamba.com" }));

const VALUES = [
  ["Trayectoria", "Desde 1990 en Zona Norte. Conocemos cada barrio, cada cuadra y a nuestra gente."],
  ["Innovación", "Marketing inmobiliario, fotografía, datos y herramientas digitales en cada propiedad."],
  ["Cercanía", "Empresa familiar: atención personal y un asesor que te acompaña de principio a fin."],
  ["Excelencia", "Cuidamos cada detalle para ofrecer una experiencia exclusiva."],
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow={`Desde ${SITE.since}`}
        crumbs={[{ label: "Inicio", href: "/inmobiliaria" }, { label: "Nosotros" }]}
        lines={["Una tradición familiar", "que se convirtió", <span key="c" className="text-naranja">en liderazgo.</span>]}
        intro={SITE.tagline}
        image={{ src: "/propiedades/9866342/01.jpg", alt: "Casa en Barrio Vicente López" }}
      />

      <section aria-labelledby="hist-t" className="py-24 lg:py-36">
        <div className="container-x">
          <p className="eyebrow mb-5 text-naranja-text">Nuestra historia</p>
          <RevealLines id="hist-t" className="mb-20 text-h2 font-light" lines={[`${yearsSince()} años`, <span key="b" className="text-naranja-ink">en Zona Norte.</span>]} />
          <Timeline items={MILESTONES} />
        </div>
      </section>

      <section aria-labelledby="mv-t" className="on-dark bg-ink py-24 text-white lg:py-36">
        <div className="container-x grid gap-16 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-5 text-naranja">Misión</p>
            <RevealLines id="mv-t" as="h2" className="text-h3 font-light" lines={["Ofrecer una experiencia inmobiliaria", <span key="b" className="text-naranja">exclusiva, cercana y profesional.</span>]} />
            <Reveal kind="fade" className="mt-6 max-w-lg text-white/70">
              Acompañar a cada familia en la decisión más importante: vender, comprar, alquilar o invertir, con información clara y compromiso total.
            </Reveal>
          </div>
          <div>
            <p className="eyebrow mb-5 text-naranja">Visión</p>
            <RevealLines as="p" className="text-h3 font-light" lines={["Ser la inmobiliaria de referencia", <span key="b" className="text-naranja">de Zona Norte.</span>]} />
            <Reveal kind="fade" className="mt-6 max-w-lg text-white/70">
              Una marca familiar que crece con innovación, desarrolla con calidad que trasciende y mantiene la cercanía de siempre.
            </Reveal>
          </div>
        </div>
        <div className="container-x mt-20">
          <p className="eyebrow mb-8 text-white/70">Valores</p>
          <Reveal kind="stagger" className="grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(([t, d], i) => (
              <div key={t} className="bg-ink p-7">
                <span className="text-sm font-semibold text-naranja">0{i + 1}</span>
                <h3 className="mt-6 text-2xl font-light">{t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{d}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="team-t" className="py-24 lg:py-36">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-5 text-naranja-text">Equipo</p>
              <RevealLines id="team-t" className="text-h2 font-light" lines={["Las personas", <span key="b" className="text-naranja-ink">detrás de cada operación.</span>]} />
            </div>
            <p className="max-w-sm text-sm text-gris-text">Fotos, nombres y contactos del equipo pendientes de confirmación por el cliente.</p>
          </div>
          <Reveal kind="stagger" className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m, i) => (
              <article key={i} className="group">
                <div className="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-[var(--radius-card)] border border-dashed border-ink/15 bg-arena">
                  <Icon name="user" size={56} strokeWidth={1} className="text-ink/20" />
                  <span className="absolute bottom-4 left-4 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-naranja-text">Foto [CONFIRMAR]</span>
                </div>
                <h3 className="mt-5 text-lg font-medium">{m.name}</h3>
                <p className="text-sm text-gris-text">{m.role}</p>
                <div className="mt-4 flex gap-2">
                  <a href={`mailto:${SITE.email}`} aria-label={`Email (${m.email})`} className="grid size-10 place-items-center rounded-full border border-ink/15 hover:border-ink">
                    <Icon name="mail" size={16} />
                  </a>
                  <a href={waLink("Hola Bellagamba! Quiero hablar con un asesor.")} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid size-10 place-items-center rounded-full border border-ink/15 hover:border-ink">
                    <WhatsAppIcon size={16} />
                  </a>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-naranja-deep py-24 text-white lg:py-32">
        <div className="container-x flex flex-wrap items-end justify-between gap-10">
          <RevealLines as="h2" className="text-h1 font-light" lines={["Trabajemos", <span key="b" className="text-ink">juntos.</span>]} />
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/inmobiliaria/contacto" variant="dark" size="lg" arrow>
              Contactanos
            </ButtonLink>
            <ButtonLink href="/inmobiliaria/tasacion" variant="light" size="lg">
              Tasar mi propiedad
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
