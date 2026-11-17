import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { Marquee } from "@/components/ui/Marquee";
import { ShulbiusMark } from "@/components/ui/Logo";
import { TasacionForm } from "@/components/forms/TasacionForm";
import { ContactForm } from "@/components/forms/ContactForm";
import { LazyMap } from "@/components/map/LazyMap";
import { SITE, waLink, yearsSince } from "@/lib/site";
import type { Review } from "@/lib/reviews";

/* ---------------- Explorá por zona ---------------- */
export interface Zone {
  name: string;
  count: number;
  href: string;
  img: string;
  blur?: string;
}
export function Zones({ zones }: { zones: Zone[] }) {
  return (
    <section aria-labelledby="zonas-t" className="bg-white py-24 lg:py-36">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-5 text-naranja-text">Explorá por zona</p>
            <RevealLines
              id="zonas-t"
              className="text-h2 font-light"
              lines={[
                "Conocemos cada cuadra",
                <span key="b">
                  de <span className="text-naranja-ink">Zona Norte.</span>
                </span>,
              ]}
            />
          </div>
          <Reveal kind="fade" className="text-lg text-gris-text lg:col-span-5">
            Más de {yearsSince()} años trabajando en Vicente López, Olivos, Florida, Martínez y alrededores. Elegí tu barrio y mirá lo que tenemos hoy.
          </Reveal>
        </div>
        <Reveal kind="stagger" className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {zones.map((z, i) => (
            <Link
              key={z.name}
              href={z.href}
              data-cursor="Explorar"
              className={clsx("group relative isolate flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[var(--radius-card)] p-5 text-white", i === 0 && "col-span-2 aspect-[16/10] lg:col-span-1 lg:aspect-[3/4]")}
            >
              <Image src={z.img} alt="" fill sizes="(min-width: 1024px) 20vw, 50vw" placeholder={z.blur ? "blur" : "empty"} blurDataURL={z.blur} className="-z-10 object-cover transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-110" />
              <span className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
              <span className="absolute right-4 top-4 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tabular-nums backdrop-blur">
                {z.count} {z.count === 1 ? "propiedad" : "propiedades"}
              </span>
              <span className="text-2xl font-light tracking-tight sm:text-[1.75rem]">{z.name}</span>
              <span className="mt-2 inline-flex items-center gap-1.5 text-sm text-white/80">
                Ver propiedades <Icon name="arrow" size={15} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Contadores ---------------- */
export function Stats() {
  const items = [
    { kind: "num" as const, to: 1990, format: false, label: "Desde", sub: "Empresa familiar en Zona Norte" },
    { kind: "num" as const, to: yearsSince(), prefix: "+", label: "Años", sub: "de trayectoria ininterrumpida" },
    { kind: "num" as const, to: 300, prefix: "+", label: "Propiedades", sub: "en cartera" },
    { kind: "text" as const, text: "[CONFIRMAR]", label: "Google", sub: "Valoración de nuestros clientes" },
  ];
  return (
    <section aria-label="Bellagamba en números" className="border-y border-ink/10 bg-crema">
      <div className="container-x grid grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <div key={it.label} className={clsx("py-12 lg:py-16", i % 2 === 1 && "border-l border-ink/10 pl-6 lg:pl-10", i >= 2 && "max-lg:border-t max-lg:border-ink/10", i === 2 && "lg:border-l lg:border-ink/10 lg:pl-10", i === 3 && "lg:pl-10")}>
            <p className="eyebrow text-gris-text">{it.label}</p>
            <p className="mt-4 text-[clamp(2.5rem,1.6rem+3.5vw,5rem)] font-light leading-none tracking-[-0.04em]">
              {it.kind === "num" ? (
                <Counter to={it.to} prefix={it.prefix} format={it.format !== false} />
              ) : (
                <span className="flex items-center gap-2 text-[clamp(1.4rem,1rem+1.5vw,2.25rem)]">
                  <Icon name="star" size={28} className="fill-naranja text-naranja" /> {it.text}
                </span>
              )}
            </p>
            <p className="mt-3 text-sm text-gris-text">{it.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Bloque naranja pleno ---------------- */
export function OrangeBlock() {
  return (
    <section aria-label="Nuestra propuesta" className="relative overflow-hidden bg-naranja-deep py-28 text-white lg:py-44">
      <div className="container-x relative">
        <RevealLines
          as="p"
          className="max-w-6xl text-[clamp(2.4rem,1.4rem+4.6vw,6.5rem)] font-light leading-[1] tracking-[-0.04em]"
          lines={["Inmobiliaria moderna,", <span key="2" className="text-ink">100% dedicada</span>, <span key="3" className="text-ink">a nuestros clientes.</span>]}
        />
        <Reveal kind="fade" delay={300} className="mt-14 flex flex-wrap items-center gap-6">
          <ButtonLink href="/inmobiliaria/contacto" variant="dark" size="lg" arrow>
            Hablemos
          </ButtonLink>
          <p className="max-w-sm text-[15px] text-white">Tecnología, marketing y trato personal: la experiencia exclusiva que nos define desde {SITE.since}.</p>
        </Reveal>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-8 left-0 right-0 opacity-[0.12]">
        <Marquee duration={60}>
          {/* SVG: decorativo, fuera del chequeo de contraste */}
          <svg viewBox="0 0 6400 200" className="h-[12vw] w-auto max-w-none px-8" aria-hidden="true">
            <text x="0" y="165" fontSize="190" fontWeight="600" letterSpacing="-8" fill="#141414" fontFamily="var(--font-sans)">
              Vicente López · Olivos · Florida · Martínez · Tigre · San Isidro ·
            </text>
          </svg>
        </Marquee>
      </div>
    </section>
  );
}

/* ---------------- Servicios ---------------- */
const SERVICES = [
  {
    t: "Venta",
    icon: "home",
    d: "Vendemos tu propiedad al mejor valor de mercado, con marketing de primer nivel.",
    b: ["Tasación profesional", "Fotos y piezas de alto impacto", "Difusión en portales y redes", "Acompañamiento hasta la escritura"],
    href: "/inmobiliaria/contacto?asunto=vender",
    cta: "Quiero vender",
  },
  {
    t: "Alquiler",
    icon: "key",
    d: "Encontramos inquilinos confiables y gestionamos el contrato de punta a punta.",
    b: ["Análisis de garantías", "Contratos claros y seguros", "Difusión segmentada", "Atención personalizada"],
    href: "/inmobiliaria/contacto?asunto=alquilar",
    cta: "Alquilar mi propiedad",
  },
  {
    t: "Tasación",
    icon: "coin",
    d: "Conocé el valor real de tu propiedad con un informe comparativo de mercado.",
    b: ["Análisis comparativo de mercado", "Informe profesional", "Respuesta en 24/48 hs", "Especialistas en Zona Norte"],
    href: "/inmobiliaria/tasacion",
    cta: "Tasar mi propiedad",
  },
  {
    t: "Búsqueda personalizada",
    icon: "search",
    d: "Buscamos la propiedad por vos, incluso las que todavía no se publicaron.",
    b: ["Búsqueda a medida", "Acceso a oportunidades off-market", "Alertas de nuevos ingresos", "Un asesor dedicado"],
    href: "/inmobiliaria/busqueda-personalizada",
    cta: "Empezar mi búsqueda",
  },
];
export function Services() {
  return (
    <section aria-labelledby="serv-t" className="py-24 lg:py-36">
      <div className="container-x">
        <p className="eyebrow mb-5 text-naranja-text">Servicios</p>
        <RevealLines
          id="serv-t"
          className="max-w-4xl text-h2 font-light"
          lines={[
            "Todo lo que necesitás,",
            <span key="b">
              en <span className="text-naranja-ink">un solo lugar.</span>
            </span>,
          ]}
        />
        <Reveal kind="stagger" className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((s) => (
            <article key={s.t} className="group relative flex flex-col rounded-[var(--radius-card)] bg-white p-7 ring-1 ring-ink/5 transition-[transform,box-shadow] duration-500 ease-[var(--ease-expo)] hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgb(20_20_20/0.3)]">
              <span className="grid size-12 place-items-center rounded-full bg-crema transition-colors duration-500 group-hover:bg-naranja">
                <Icon name={s.icon} size={22} />
              </span>
              <h3 className="mt-8 text-2xl font-medium tracking-tight">{s.t}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-gris-text">{s.d}</p>
              <ul className="mb-8 mt-6 space-y-2.5 text-[14px]">
                {s.b.map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <Icon name="check" size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-naranja-text" /> {b}
                  </li>
                ))}
              </ul>
              <Link href={s.href} className="mt-auto inline-flex items-center gap-2 text-sm font-semibold after:absolute after:inset-0 after:rounded-[var(--radius-card)]">
                {s.cta} <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </article>
          ))}
        </Reveal>
        {/* 5ª card destacada: Desarrollos */}
        <Reveal kind="fade" className="mt-4">
          <Link href="/desarrolladora" className="on-dark group relative grid overflow-hidden rounded-[var(--radius-card)] bg-ink text-white md:grid-cols-[1.2fr_1fr]">
            <div className="flex flex-col justify-between gap-10 p-8 lg:p-12">
              <div>
                <p className="eyebrow text-naranja">Desarrolladora</p>
                <h3 className="mt-6 text-h3 font-light">
                  ¿Ya conocés nuestros desarrollos? <span className="text-naranja">Sé parte y descubrilos.</span>
                </h3>
                <p className="mt-4 max-w-md text-white/70">Calidad que trasciende. Proyectos propios en Vicente López bajo la marca Shulbius.</p>
              </div>
              <span className="inline-flex items-center gap-3 text-sm font-semibold">
                <span className="grid size-12 place-items-center rounded-full bg-naranja text-ink transition-transform duration-500 group-hover:rotate-[-45deg]">
                  <Icon name="arrow" size={20} />
                </span>
                Conocé la Desarrolladora
              </span>
            </div>
            <div className="relative min-h-64 overflow-hidden">
              <Image src="/propiedades/13113629/01.jpg" alt="Shulbius Kite, rooftop con piscina" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-105" />
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Shulbius ---------------- */
export function ShulbiusSection({ kiteHref }: { kiteHref: string }) {
  return (
    <section aria-labelledby="shul-t" className="on-dark relative overflow-hidden bg-ink py-24 text-white lg:py-40">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <ShulbiusMark className="h-16 w-auto text-naranja" />
          <p className="mt-8 text-[13px] font-medium uppercase tracking-shulbius text-white/70">Shulbius · Desarrollos</p>
          <RevealLines
            id="shul-t"
            className="mt-6 text-h1 font-light"
            lines={["Calidad", <span key="b" className="text-naranja">que trasciende.</span>]}
          />
          <Reveal kind="fade" className="mt-8 max-w-lg text-lg leading-relaxed text-white/70">
            Shulbius es nuestra marca de desarrollos premium en Vicente López: edificios de diseño, materiales nobles y foco absoluto en la calidad de vida. Kite, Mill3, Drei, Emme, Doc, Dream.
          </Reveal>
          <Reveal kind="fade" delay={200} className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/desarrolladora/shulbius" variant="primary" size="lg" arrow>
              Conocé nuestros desarrollos
            </ButtonLink>
          </Reveal>
        </div>
        <Reveal kind="clip" className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] lg:aspect-[4/5]">
          <Image src="/propiedades/13113629/01.jpg" alt="Shulbius Kite: rooftop con espejo de agua en Olivos" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-ink/90 to-transparent p-6 pt-24">
            <div>
              <p className="text-[12px] uppercase tracking-shulbius text-white/80">Shulbius Kite</p>
              <p className="mt-2 text-xl font-light">Juan Díaz de Solís 2200 · Olivos</p>
            </div>
            <Link href={kiteHref} className="shrink-0 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-ink hover:bg-naranja">
              Ver unidad
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Tasación embebida ---------------- */
export function TasacionSection() {
  const benefits = [
    ["chart", "Análisis comparativo de mercado"],
    ["file", "Informe profesional"],
    ["clock", "Respuesta en 24/48 hs"],
    ["pin", "Especialistas en Zona Norte"],
  ];
  return (
    <section id="tasacion" aria-labelledby="tas-t" className="bg-white py-24 lg:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-5 text-naranja-text">Tasaciones</p>
          <RevealLines
            id="tas-t"
            className="text-h2 font-light"
            lines={["Conocé el valor real", <span key="b" className="text-naranja-ink">de tu propiedad.</span>]}
          />
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {benefits.map(([i, t]) => (
              <li key={t} className="flex items-center gap-4 rounded-2xl bg-crema p-4">
                <span className="grid size-10 place-items-center rounded-full bg-white">
                  <Icon name={i === "chart" ? "sliders" : i} size={18} />
                </span>
                <span className="font-medium">{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <div className="rounded-[var(--radius-card)] bg-crema p-6 sm:p-10">
            <TasacionForm />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Por qué elegirnos ---------------- */
const VALUES = [
  { t: "Trayectoria", d: `Desde ${SITE.since}, una empresa familiar que creció con Zona Norte.` },
  { t: "Innovación", d: "Marketing inmobiliario, tecnología y datos al servicio de cada operación." },
  { t: "Cercanía", d: "Un asesor que te conoce, te escucha y te acompaña en cada paso." },
  { t: "Excelencia", d: "Cuidamos cada detalle para ofrecer una experiencia exclusiva." },
];
export function WhyUs() {
  return (
    <section aria-labelledby="why-t" className="py-24 lg:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
          <p className="eyebrow mb-5 text-naranja-text">Por qué elegirnos</p>
          <RevealLines
            id="why-t"
            className="text-h2 font-light"
            lines={["Una tradición familiar", "que se convirtió", <span key="c" className="text-naranja-ink">en liderazgo.</span>]}
          />
          <Reveal kind="fade" className="mt-8">
            <ButtonLink href="/inmobiliaria/nosotros" variant="outline" arrow>
              Conocé nuestra historia
            </ButtonLink>
          </Reveal>
        </div>
        <ol className="lg:col-span-6 lg:col-start-7">
          {VALUES.map((v, i) => (
            <Reveal as="li" kind="fade" key={v.t} className="group grid grid-cols-[auto_1fr] gap-6 border-t border-ink/10 py-10 last:border-b">
              <span className="pt-2 text-sm font-semibold tabular-nums text-naranja-text">0{i + 1}</span>
              <div>
                <h3 className="text-h3 font-light transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-2">{v.t}</h3>
                <p className="mt-3 max-w-md text-gris-text">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- Testimonios de Google ---------------- */
export function Testimonials({ reviews, rating, total }: { reviews: Review[]; rating: number | null; total: number | null }) {
  const list = reviews.length < 6 ? [...reviews, ...reviews] : reviews;
  return (
    <section aria-labelledby="test-t" className="overflow-hidden bg-white py-24 lg:py-32">
      <div className="container-x flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-5 text-naranja-text">Lo que dicen nuestros clientes</p>
          <RevealLines id="test-t" className="text-h2 font-light" lines={["Reseñas", <span key="b" className="text-naranja-ink">en Google</span>]} />
        </div>
        <div className="flex items-center gap-4 rounded-full bg-crema py-2 pl-2 pr-5">
          <span className="grid size-11 place-items-center rounded-full bg-white text-lg font-bold" aria-hidden="true">
            G
          </span>
          <div>
            <p className="flex items-center gap-0.5" role="img" aria-label={rating ? `${rating} de 5` : "Valoración pendiente"}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} name="star" size={15} className="fill-naranja text-naranja" />
              ))}
            </p>
            <p className="text-[13px] font-semibold">{rating ? `${rating.toLocaleString("es-AR")} · ${total} reseñas` : "Valoración [CONFIRMAR]"}</p>
          </div>
        </div>
      </div>
      <div className="mt-14">
        <Marquee duration={50}>
          {list.map((r, i) => (
            <figure key={i} className={clsx("mx-2.5 flex w-[min(82vw,400px)] shrink-0 flex-col rounded-[var(--radius-card)] p-7", r.pending ? "border border-dashed border-ink/20 bg-crema/60" : "bg-crema")}>
              <div className="flex gap-0.5" role="img" aria-label={`${r.rating} estrellas`}>
                {Array.from({ length: 5 }).map((_, k) => (
                  <Icon key={k} name="star" size={16} className={k < r.rating ? "fill-naranja text-naranja" : "text-gris"} />
                ))}
              </div>
              <blockquote className={clsx("mt-5 flex-1 text-[15px] leading-relaxed", r.pending && "text-gris-text")}>“{r.text}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-ink text-sm font-semibold text-white">{r.pending ? "?" : r.author[0]}</span>
                <span>
                  <span className={clsx("block text-sm font-semibold", r.pending && "text-naranja-text")}>{r.author}</span>
                  <span className="block text-[12px] text-gris-text">{r.relativeTime ?? "Google"}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

/* ---------------- Contacto ---------------- */
export function ContactSection({ form }: { form?: React.ReactNode }) {
  return (
    <section id="contacto" aria-labelledby="cont-t" className="py-24 lg:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-5 text-naranja-text">Contacto</p>
          <RevealLines id="cont-t" className="text-h2 font-light" lines={["Estamos para", <span key="b" className="text-naranja-ink">ayudarte.</span>]} />
          <dl className="mt-10 grid gap-6 text-[15px] sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <dt className="eyebrow text-gris-text">Casa central</dt>
              <dd className="mt-2">
                {SITE.address.street}, {SITE.address.city}
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-gris-text">Teléfono y WhatsApp</dt>
              <dd className="mt-2 space-y-1">
                <a href={SITE.phoneHref} className="block hover:text-naranja-text">
                  {SITE.phone}
                </a>
                <a href={waLink("Hola Bellagamba! Quiero hacer una consulta.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-naranja-text">
                  <WhatsAppIcon size={16} /> {SITE.whatsappDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-gris-text">Email</dt>
              <dd className="mt-2">
                <a href={`mailto:${SITE.email}`} className="hover:text-naranja-text">
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-gris-text">Horarios</dt>
              <dd className="mt-2 space-y-1">
                {SITE.hours.map((h) => (
                  <p key={h.days}>
                    {h.days}: {h.time}
                  </p>
                ))}
              </dd>
            </div>
          </dl>
          <LazyMap
            markers={[{ id: "oficina", lat: SITE.address.lat, lng: SITE.address.lng, label: "Bellagamba", title: `Oficina Bellagamba, ${SITE.address.street}`, variant: "office" }]}
            zoom={15}
            ariaLabel="Mapa de la oficina de Bellagamba"
            className="mt-10 aspect-[16/10] rounded-[var(--radius-card)]"
          />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <div className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-ink/5 sm:p-10">
            <p className="mb-8 text-h3 font-light">Escribinos</p>
            {form ?? <ContactForm />}
          </div>
        </div>
      </div>
    </section>
  );
}
