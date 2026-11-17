"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Icon } from "@/components/ui/Icon";
import { SearchBox, type Facet } from "./SearchBox";

export interface HeroSlide {
  src: string;
  blur?: string;
  caption: string;
  price: string;
  href: string;
}

/** Hero full-screen: Ken Burns + crossfade entre 3 fotos reales, titular con reveal por líneas y buscador protagonista. */
export function Hero({ slides, zonas, tipos }: { slides: HeroSlide[]; zonas: Facet[]; tipos: Facet[] }) {
  const [i, setI] = useState(0);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 6500);
    return () => clearInterval(t);
  }, [slides.length]);
  const cur = slides[i];

  return (
    <section aria-label="Portada" className="on-dark relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 -z-10">
        {slides.map((s, k) => (
          <div
            key={s.src}
            className={clsx("absolute inset-0 transition-opacity duration-[1600ms] ease-in-out", k === i ? "opacity-100" : "opacity-0")}
            aria-hidden={k !== i}
          >
            {(k === 0 || loaded) && (
              <Image
                src={s.src}
                alt={k === 0 ? s.caption : ""}
                fill
                priority={k === 0}
                fetchPriority={k === 0 ? "high" : undefined}
                sizes="100vw"
                quality={80}
                placeholder={s.blur ? "blur" : "empty"}
                blurDataURL={s.blur}
                className="object-cover"
                style={{ animation: k === i ? "kenburns 9s ease-out both" : undefined }}
              />
            )}
          </div>
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(20_20_20/0.55)_0%,rgb(20_20_20/0.05)_30%,rgb(20_20_20/0.25)_55%,rgb(20_20_20/0.85)_100%)]" />
      </div>

      <div className="container-x pb-24 pt-28 sm:pb-12 sm:pt-36 lg:pb-14">
        <p className="eyebrow mb-6 flex items-center gap-3 text-white/85">
          <span className="h-px w-10 bg-naranja" /> Zona Norte desde 1990
        </p>
        <h1 className="hero-title max-w-5xl text-display font-light text-balance">
          <span className="rl" style={{ "--i": 0 } as React.CSSProperties}>
            <span>Encontrá ese inmueble</span>
          </span>
          <span className="rl" style={{ "--i": 1 } as React.CSSProperties}>
            <span className="text-naranja">que cumple con todo</span>
          </span>
          <span className="rl" style={{ "--i": 2 } as React.CSSProperties}>
            <span className="text-naranja">eso que querés.</span>
          </span>
        </h1>

        <div className="mt-10 grid items-end gap-8 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="hero-fade max-w-5xl" style={{ "--d": "500ms" } as React.CSSProperties}>
            <SearchBox zonas={zonas} tipos={tipos} />
          </div>
          <Link
            href={cur.href}
            className="hero-fade group hidden max-w-xs items-center gap-4 rounded-2xl bg-white/10 p-3 pr-5 backdrop-blur-md transition-colors hover:bg-white/20 lg:flex"
            style={{ "--d": "700ms" } as React.CSSProperties}
          >
            <span className="relative flex gap-1" aria-hidden="true">
              {slides.map((s, k) => (
                <span key={s.src} className="h-8 w-1 overflow-hidden rounded-full bg-white/25">
                  <span className={clsx("block w-full bg-naranja", k === i ? "h-full transition-[height] duration-[6500ms] ease-linear" : k < i ? "h-full" : "h-0")} />
                </span>
              ))}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] text-white/75">{cur.caption}</span>
              <span className="block font-semibold">{cur.price}</span>
            </span>
            <Icon name="arrow-up-right" size={18} className="shrink-0 transition-transform group-hover:rotate-45" />
          </Link>
        </div>
      </div>

      <div className="hero-fade absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block" style={{ "--d": "900ms" } as React.CSSProperties} aria-hidden="true">
        <span className="block h-10 w-px overflow-hidden bg-white/20">
          <span className="block h-1/2 w-full animate-[scrollhint_1.8s_ease-in-out_infinite] bg-white" />
        </span>
      </div>
    </section>
  );
}
