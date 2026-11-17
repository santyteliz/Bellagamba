import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { SITE, yearsSince } from "@/lib/site";

const COLS = [
  {
    title: "Propiedades",
    links: [
      { label: "Venta", href: "/inmobiliaria/venta" },
      { label: "Alquiler", href: "/inmobiliaria/alquiler" },
      { label: "Temporario", href: "/inmobiliaria/temporario" },
      { label: "Todas las propiedades", href: "/inmobiliaria/propiedades" },
      { label: "Emprendimientos", href: "/inmobiliaria/emprendimientos" },
      { label: "Favoritos", href: "/inmobiliaria/favoritos" },
    ],
  },
  {
    title: "Servicios",
    links: [
      { label: "Tasaciones", href: "/inmobiliaria/tasacion" },
      { label: "Búsqueda personalizada", href: "/inmobiliaria/busqueda-personalizada" },
      { label: "Desarrolladora", href: "/desarrolladora" },
      { label: "Shulbius", href: "/desarrolladora/shulbius" },
      { label: "Portal de clientes", href: "/portal-clientes" },
    ],
  },
  {
    title: "Bellagamba",
    links: [
      { label: "Nosotros", href: "/inmobiliaria/nosotros" },
      { label: "Contacto", href: "/inmobiliaria/contacto" },
      { label: "Política de privacidad", href: "/politica-de-privacidad" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="no-print on-dark relative overflow-hidden bg-ink text-white">
      <div className="container-x pb-10 pt-20 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo variant="blanco" className="w-44" />
            <p className="mt-8 max-w-md text-h3 font-light text-white/90">
              Una tradición familiar que se convirtió en <span className="text-naranja">liderazgo.</span>
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
              Desde {SITE.since}, más de {yearsSince()} años en Zona Norte. {SITE.tagline}
            </p>
            <div className="mt-10 max-w-md">
              <p className="eyebrow mb-4 text-white/70">Newsletter · Oportunidades antes que nadie</p>
              <NewsletterForm />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            {COLS.map((c) => (
              <div key={c.title}>
                <p className="eyebrow mb-5 text-naranja">{c.title}</p>
                <ul className="space-y-3 text-[15px]">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-white/80 transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-2 grid gap-8 border-t border-white/10 pt-10 sm:col-span-3 sm:grid-cols-3">
              <div>
                <p className="eyebrow mb-4 text-white/70">Casa central</p>
                <address className="space-y-1.5 text-[15px] not-italic text-white/85">
                  <p>{SITE.address.street}</p>
                  <p>
                    {SITE.address.city} ({SITE.address.postalCode})
                  </p>
                </address>
              </div>
              <div>
                <p className="eyebrow mb-4 text-white/70">Contacto</p>
                <ul className="space-y-1.5 text-[15px] text-white/85">
                  <li>
                    <a href={SITE.phoneHref} className="hover:text-naranja">
                      Tel. {SITE.phone}
                    </a>
                  </li>
                  <li>
                    <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-naranja">
                      WhatsApp {SITE.whatsappDisplay}
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${SITE.email}`} className="hover:text-naranja">
                      {SITE.email}
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="eyebrow mb-4 text-white/70">Horarios</p>
                <ul className="space-y-1.5 text-[15px] text-white/85">
                  {SITE.hours.map((h) => (
                    <li key={h.days}>
                      {h.days}: {h.time}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-white/10 pt-8 text-[13px] text-white/60 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>© {new Date().getFullYear()} {SITE.legalName}</span>
            <span>Matrículas: {SITE.matriculas}</span>
            <Link href="/politica-de-privacidad" className="hover:text-white">
              Política de privacidad
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <SocialLink href={SITE.social.instagram} label="Instagram" icon="instagram" />
            <SocialLink href={SITE.social.facebook} label="Facebook [CONFIRMAR]" icon="facebook" />
            <SocialLink href={SITE.social.linkedin} label="LinkedIn [CONFIRMAR]" icon="linkedin" />
            <SocialLink href={SITE.social.youtube} label="YouTube [CONFIRMAR]" icon="youtube" />
          </div>
        </div>
      </div>
      <svg aria-hidden="true" viewBox="0 0 1000 150" className="pointer-events-none block w-full select-none" preserveAspectRatio="xMidYMax meet">
        <text x="500" y="135" textAnchor="middle" fontSize="182" fontWeight="600" letterSpacing="-10" fill="#fff" fillOpacity="0.04" fontFamily="var(--font-sans)">
          BELLAGAMBA
        </text>
      </svg>
    </footer>
  );
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  // Redes sin URL confirmada: se muestran deshabilitadas (sin link muerto)
  if (!href)
    return (
      <span title={label} className="grid size-10 place-items-center rounded-full border border-white/10 text-white/25">
        <Icon name={icon} size={16} />
        <span className="sr-only">{label}</span>
      </span>
    );
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-full border border-white/15 transition-colors hover:border-naranja hover:bg-naranja hover:text-ink">
      <Icon name={icon} size={16} />
    </a>
  );
}
