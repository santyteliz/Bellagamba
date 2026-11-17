"use client";
import Link from "next/link";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { PropertyCard as Card } from "@/lib/properties/types";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Icon } from "@/components/ui/Icon";
import { RevealLines } from "@/components/ui/Reveal";

type Tab = "todas" | "venta" | "alquiler";

/** Destacadas con pestañas. Desktop: carrusel horizontal pinned al scroll (GSAP). Mobile: scroll-snap nativo. */
export function FeaturedCarousel({ items }: { items: Card[] }) {
  const [tab, setTab] = useState<Tab>("todas");
  const list = useMemo(() => (tab === "todas" ? items : items.filter((p) => p.operacion === tab)), [items, tab]);
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches || list.length < 3) return;
    let ctx: { revert(): void } | null = null;
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled || !section.current || !track.current) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const t = track.current!;
        const dist = () => Math.max(0, t.scrollWidth - t.clientWidth);
        gsap.to(t, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => setProgress(self.progress),
          },
        });
      }, section);
      ScrollTrigger.refresh();
    })();
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [list]);

  return (
    <section ref={section} aria-labelledby="dest-t" className="relative overflow-hidden bg-crema py-20 lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:py-16">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="eyebrow mb-5 text-naranja-text">Selección Bellagamba</p>
            <RevealLines
              id="dest-t"
              className="text-h2 font-light"
              lines={[
                "Propiedades",
                <span key="b" className="text-naranja-ink">
                  destacadas
                </span>,
              ]}
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div role="tablist" aria-label="Filtrar destacadas" className="inline-flex rounded-full bg-white p-1 ring-1 ring-ink/5">
              {(["todas", "venta", "alquiler"] as Tab[]).map((t) => (
                <button
                  key={t}
                  role="tab"
                  type="button"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={clsx("relative h-10 rounded-full px-5 text-sm font-semibold capitalize transition-colors", tab === t ? "text-white" : "text-ink/70 hover:text-ink")}
                >
                  {tab === t && <motion.span layoutId="dest-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                  <span className="relative">{t}</span>
                </button>
              ))}
            </div>
            <Link href="/inmobiliaria/propiedades" className="group inline-flex items-center gap-2 text-sm font-semibold">
              Ver todas las propiedades <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="container-x mt-12">
          <div className="rounded-[var(--radius-card)] border border-dashed border-ink/15 bg-white/60 px-6 py-16 text-center">
            <p className="text-h3 font-light">Pronto vas a ver alquileres destacados acá.</p>
            <p className="mx-auto mt-3 max-w-md text-gris-text">Mientras tanto, contanos qué buscás y te avisamos apenas ingrese algo para vos.</p>
            <Link href="/inmobiliaria/busqueda-personalizada" className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-naranja px-6 text-sm font-semibold text-ink hover:bg-ink hover:text-white">
              Búsqueda personalizada <Icon name="arrow" size={16} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-12 lg:mt-14">
          <div
            ref={track}
            className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-pl-4 px-4 pb-4 sm:scroll-pl-6 sm:px-6 lg:snap-none lg:gap-8 lg:overflow-visible lg:px-10 2xl:px-[max(2.5rem,calc((100vw-96rem)/2+2.5rem))]"
          >
            {list.map((p, k) => (
              <div key={p.id} className="w-[84vw] max-w-[440px] shrink-0 snap-start sm:w-[46vw] lg:w-[min(34vw,460px)]">
                <PropertyCard p={p} sizes="(min-width: 1024px) 460px, 84vw" priority={false} />
                <span className="sr-only">
                  {k + 1} de {list.length}
                </span>
              </div>
            ))}
            <Link
              href="/inmobiliaria/propiedades"
              data-cursor="Ver todas"
              className="group flex w-[70vw] max-w-[360px] shrink-0 snap-start flex-col justify-between rounded-[var(--radius-card)] bg-ink p-8 text-white sm:w-[40vw] lg:w-[min(26vw,360px)]"
            >
              <span className="eyebrow text-naranja">Cartera completa</span>
              <span className="text-h3 font-light">
                Ver todas las <span className="text-naranja">propiedades</span>
              </span>
              <span className="grid size-14 place-items-center rounded-full bg-naranja text-ink transition-transform duration-500 group-hover:rotate-[-45deg]">
                <Icon name="arrow" size={22} />
              </span>
            </Link>
          </div>
          <div className="container-x mt-8 hidden lg:block" aria-hidden="true">
            <div className="h-px w-full bg-ink/10">
              <div className="h-px origin-left bg-ink" style={{ transform: `scaleX(${progress})` }} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
