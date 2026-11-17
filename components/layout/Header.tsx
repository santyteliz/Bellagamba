"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { NAV, SITE } from "@/lib/site";
import { favoritesStore, compareStore } from "@/lib/store";

/** Rutas con hero oscuro a sangre: header transparente con texto blanco hasta scrollear */
const DARK_HERO = [/^\/inmobiliaria\/?$/, /^\/desarrolladora/, /^\/inmobiliaria\/nosotros$/, /^\/inmobiliaria\/emprendimientos$/];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const favs = favoritesStore.use();
  const compare = compareStore.use();
  const darkHero = DARK_HERO.some((r) => r.test(pathname));
  const isDesarrolladora = pathname.startsWith("/desarrolladora");

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 600 && y > last + 4);
      if (y < last - 4) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open]);

  if (pathname === "/" || pathname.startsWith("/ficha-pdf")) return null;

  const light = darkHero && !scrolled && !open; // texto blanco
  const onDark = isDesarrolladora; // header negro en la desarrolladora

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white">
        Saltar al contenido
      </a>
      <header
        className={clsx(
          "no-print fixed inset-x-0 top-0 z-50 transition-[transform,background,box-shadow,height] duration-500 ease-[var(--ease-expo)]",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          scrolled && !open && (onDark ? "bg-ink/85 shadow-[0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-xl" : "bg-crema/85 shadow-[0_1px_0_rgb(20_20_20/0.06)] backdrop-blur-xl")
        )}
      >
        <div className={clsx("container-x flex items-center justify-between gap-6 transition-[height] duration-500 ease-[var(--ease-expo)]", scrolled ? "h-16" : "h-20 lg:h-24")}>
          <Link href="/inmobiliaria" aria-label="Bellagamba, ir al inicio" className="relative z-10 shrink-0">
            <Logo variant={light || onDark || open ? "blanco" : "color"} className={clsx("transition-[width] duration-500", scrolled ? "w-32" : "w-36 lg:w-40")} priority />
          </Link>

          <nav aria-label="Principal" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={clsx(
                        "group relative rounded-full px-3 py-2 text-[13px] font-medium transition-colors",
                        light || onDark ? "text-white/90 hover:text-white" : "text-ink/75 hover:text-ink",
                        active && (light || onDark ? "text-white" : "text-ink")
                      )}
                    >
                      {item.label}
                      <span
                        className={clsx(
                          "absolute inset-x-3 -bottom-0.5 h-px origin-left bg-naranja transition-transform duration-500 ease-[var(--ease-expo)]",
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Bellagamba"
              className={clsx("hidden size-10 place-items-center rounded-full transition-colors 2xl:grid", light || onDark || open ? "text-white hover:bg-white/10" : "hover:bg-ink/5")}
            >
              <Icon name="instagram" size={18} />
            </a>
            {compare.length > 0 && (
              <Link
                href="/inmobiliaria/comparar"
                aria-label={`Comparar ${compare.length} propiedades`}
                className={clsx("hidden h-10 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold sm:inline-flex", light || onDark || open ? "text-white hover:bg-white/10" : "hover:bg-ink/5")}
              >
                <Icon name="compare" size={18} /> {compare.length}
              </Link>
            )}
            <Link
              href="/inmobiliaria/favoritos"
              aria-label={`Favoritos (${favs.length})`}
              className={clsx(
                "relative inline-flex h-10 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold transition-colors",
                light || onDark || open ? "border-white/30 text-white hover:bg-white hover:text-ink" : "border-ink/15 hover:border-ink hover:bg-ink hover:text-white"
              )}
            >
              <motion.span key={favs.length} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 18 }} className="tabular-nums">
                {favs.length}
              </motion.span>
              <Icon name="heart" size={16} className={favs.length ? "fill-naranja text-naranja" : ""} />
            </Link>
            <Link
              href="/portal-clientes"
              className={clsx(
                "hidden h-10 items-center gap-2 rounded-full px-4 text-[13px] font-semibold transition-colors md:inline-flex",
                light || onDark || open ? "bg-white text-ink hover:bg-naranja" : "bg-ink text-white hover:bg-naranja hover:text-ink"
              )}
            >
              <Icon name="user" size={16} /> Portal de clientes
            </Link>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className={clsx("grid size-10 place-items-center rounded-full transition-colors xl:hidden", light || onDark || open ? "text-white hover:bg-white/10" : "hover:bg-ink/5")}
            >
              <span className="relative block h-3 w-5">
                <span className={clsx("absolute left-0 top-0 h-[1.5px] w-5 bg-current transition-transform duration-500 ease-[var(--ease-expo)]", open && "translate-y-[5px] rotate-45")} />
                <span className={clsx("absolute bottom-0 left-0 h-[1.5px] bg-current transition-all duration-500 ease-[var(--ease-expo)]", open ? "w-5 -translate-y-[5.5px] -rotate-45" : "w-3.5")} />
              </span>
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>{open && <MobileMenu favs={favs.length} />}</AnimatePresence>
    </>
  );
}

function MobileMenu({ favs }: { favs: number }) {
  const items = [...NAV, { label: "Favoritos", href: "/inmobiliaria/favoritos" }, { label: "Desarrolladora", href: "/desarrolladora" }];
  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      className="on-dark fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink pt-24 text-white"
      data-lenis-prevent
    >
      <nav aria-label="Menú móvil" className="container-x flex-1">
        <ul className="flex flex-col">
          {items.map((item, i) => (
            <motion.li
              key={item.href}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 + i * 0.045, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-white/10"
            >
              <Link href={item.href} className="group flex items-center justify-between py-4 text-[clamp(1.6rem,6vw,2.6rem)] font-light tracking-tight">
                <span className="transition-colors group-hover:text-naranja">
                  {item.label}
                  {item.label === "Favoritos" && favs > 0 && <sup className="ml-1 text-sm text-naranja">{favs}</sup>}
                </span>
                <Icon name="arrow-up-right" size={22} className="text-white/40 transition-all group-hover:rotate-45 group-hover:text-naranja" />
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="container-x grid gap-6 py-8 text-sm text-white/70 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="eyebrow mb-3 text-naranja">Contacto</p>
          <a href={SITE.phoneHref} className="block hover:text-white">
            Tel. {SITE.phone}
          </a>
          <a href={`mailto:${SITE.email}`} className="block hover:text-white">
            {SITE.email}
          </a>
          <p>{SITE.address.street}, {SITE.address.city}</p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <Link href="/portal-clientes" className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 font-semibold text-ink">
            <Icon name="user" size={16} /> Portal de clientes
          </Link>
          <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid size-12 place-items-center rounded-full border border-white/20">
            <Icon name="instagram" size={18} />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
