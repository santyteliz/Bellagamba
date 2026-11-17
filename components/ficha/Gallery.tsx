"use client";
import Image from "next/image";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/Icon";

const Lightbox = dynamic(() => import("./Lightbox").then((m) => m.Lightbox), { ssr: false });

// Mismo sizes en mobile y desktop para que el hero (LCP) se descargue una sola vez
const HERO_SIZES = "(min-width: 768px) 50vw, 100vw";

type Tab = "fotos" | "video" | "planos" | "tour";

/** Galería inmersiva: hero + mosaico de 4 (desktop) / carrusel con swipe (mobile). Pestañas solo si existen. */
export function Gallery({
  fotos,
  blur,
  title,
  videos = [],
  planos = [],
  tour360,
}: {
  fotos: string[];
  blur: Record<string, string>;
  title: string;
  videos?: string[];
  planos?: string[];
  tour360?: string | null;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const [mIdx, setMIdx] = useState(0);
  const [tab, setTab] = useState<Tab>("fotos");
  const tabs: { key: Tab; label: string; icon: string; n?: number }[] = [
    { key: "fotos" as Tab, label: "Fotos", icon: "camera", n: fotos.length },
    ...(videos.length ? [{ key: "video" as Tab, label: "Video", icon: "play", n: videos.length }] : []),
    ...(planos.length ? [{ key: "planos" as Tab, label: "Planos", icon: "plan", n: planos.length }] : []),
    ...(tour360 ? [{ key: "tour" as Tab, label: "Tour 360", icon: "cube" }] : []),
  ];
  const list = tab === "planos" ? planos : fotos;

  return (
    <div className="relative">
      {tab === "video" && videos[0] ? (
        <div className="relative aspect-video overflow-hidden rounded-[var(--radius-card)] bg-ink">
          <iframe src={videos[0]} title={`Video de ${title}`} className="absolute inset-0 size-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen loading="lazy" />
        </div>
      ) : tab === "tour" && tour360 ? (
        <div className="relative aspect-video overflow-hidden rounded-[var(--radius-card)] bg-ink">
          <iframe src={tour360} title={`Tour 360 de ${title}`} className="absolute inset-0 size-full" allow="fullscreen; xr-spatial-tracking" allowFullScreen loading="lazy" />
        </div>
      ) : (
        <>
          {/* Mobile: carrusel a sangre con swipe nativo */}
          <div className="relative -mx-4 sm:-mx-6 md:hidden">
            <div
              className="no-scrollbar flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto"
              onScroll={(e) => setMIdx(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
            >
              {list.map((src, i) => (
                <button key={src} type="button" onClick={() => setOpen(i)} className="relative h-full w-full shrink-0 snap-start" aria-label={`Ampliar foto ${i + 1}`}>
                  {i < 3 || Math.abs(i - mIdx) < 3 ? (
                    <Image
                      src={src}
                      alt={i === 0 ? title : `${title}, foto ${i + 1}`}
                      fill
                      sizes={i === 0 ? HERO_SIZES : "100vw"}
                      priority={i === 0}
                      fetchPriority={i === 0 ? "high" : undefined}
                      placeholder={blur[src] ? "blur" : "empty"}
                      blurDataURL={blur[src]}
                      className="object-cover"
                    />
                  ) : null}
                </button>
              ))}
            </div>
            <span className="pointer-events-none absolute bottom-3 left-4 rounded-full bg-ink/75 px-3 py-1.5 text-xs font-semibold tabular-nums text-white backdrop-blur">
              {mIdx + 1} / {list.length}
            </span>
          </div>

          {/* Desktop: hero + mosaico de 4 */}
          <div className="hidden h-[min(68vh,640px)] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-[var(--radius-card)] md:grid">
            {list.slice(0, 5).map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setOpen(i)}
                data-cursor="Ampliar"
                aria-label={`Ampliar foto ${i + 1}`}
                className={clsx("group relative overflow-hidden bg-arena", i === 0 ? "col-span-2 row-span-2" : "", list.length < 5 && i === 0 && "col-span-4")}
              >
                <Image
                  src={src}
                  alt={i === 0 ? title : `${title}, foto ${i + 1}`}
                  fill
                  sizes={i === 0 ? HERO_SIZES : "(min-width: 1536px) 380px, 25vw"}
                  priority={i === 0}
                  fetchPriority={i === 0 ? "high" : undefined}
                  placeholder={blur[src] ? "blur" : "empty"}
                  blurDataURL={blur[src]}
                  className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/10" />
              </button>
            ))}
          </div>
        </>
      )}

      {/* Barra de pestañas + ver todas */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 md:absolute md:bottom-4 md:left-4 md:right-4 md:mt-0">
        {tabs.length > 1 ? (
          <div role="tablist" aria-label="Multimedia" className="flex gap-1 rounded-full bg-white/95 p-1 shadow-lg backdrop-blur">
            {tabs.map((t) => (
              <button
                key={t.key}
                role="tab"
                type="button"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={clsx("inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition-colors", tab === t.key ? "bg-ink text-white" : "hover:bg-ink/5")}
              >
                <Icon name={t.icon} size={15} /> {t.label}
                {t.n ? <span className="opacity-60">{t.n}</span> : null}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}
        {(tab === "fotos" || tab === "planos") && (
          <button
            type="button"
            onClick={() => setOpen(0)}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[13px] font-semibold shadow-lg transition-colors hover:bg-naranja max-md:border max-md:border-ink/10 max-md:shadow-none"
          >
            <Icon name="grid" size={16} /> Ver las {list.length} {tab === "planos" ? "imágenes" : "fotos"}
          </button>
        )}
      </div>

      <AnimatePresence>{open !== null && <Lightbox fotos={list} blur={blur} start={open} title={title} onClose={() => setOpen(null)} />}</AnimatePresence>
    </div>
  );
}
