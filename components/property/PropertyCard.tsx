"use client";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useRef, useState } from "react";
import type { PropertyCard as Card } from "@/lib/properties/types";
import { formatM2, formatPrice } from "@/lib/format";
import { OPERACION_LABEL } from "@/lib/properties/filters";
import { Icon } from "@/components/ui/Icon";
import { FavoriteButton } from "./FavoriteButton";
import { CompareButton } from "./CompareButton";

export function PropertyCard({
  p,
  layout = "grid",
  priority,
  onHover,
  highlighted,
  sizes = "(min-width: 1280px) 30vw, (min-width: 768px) 46vw, 92vw",
  className,
}: {
  p: Card;
  layout?: "grid" | "list";
  priority?: boolean;
  onHover?: (id: number | null) => void;
  highlighted?: boolean;
  sizes?: string;
  className?: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [armed, setArmed] = useState(false); // monta las fotos 2..n recién al interactuar (performance)
  const fotos = p.fotos.length ? p.fotos : [p.foto_portada];
  const go = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    setArmed(true);
    const next = (idx + dir + fotos.length) % fotos.length;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };
  const meta = [p.tipo, p.dormitorios ? `${p.dormitorios} dorm.` : p.ambientes ? `${p.ambientes} amb.` : null].filter(Boolean).join(" · ");
  const isList = layout === "list";

  return (
    <article
      className={clsx("group/card relative", isList && "grid gap-5 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] sm:items-center", className)}
      onPointerEnter={() => {
        setArmed(true);
        onHover?.(p.id);
      }}
      onPointerLeave={() => onHover?.(null)}
      onFocus={() => setArmed(true)}
      onTouchStart={() => setArmed(true)}
    >
      <div className={clsx("relative overflow-hidden rounded-[var(--radius-card)] bg-arena transition-shadow duration-500", highlighted && "ring-2 ring-naranja ring-offset-4 ring-offset-crema")}>
        <Link href={p.href} tabIndex={-1} aria-hidden="true" data-cursor="Ver" className="block">
          <div
            ref={scroller}
            onScroll={(e) => {
              const el = e.currentTarget;
              setIdx(Math.round(el.scrollLeft / el.clientWidth));
            }}
            className="no-scrollbar flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
          >
            {fotos.map((src, i) => (
              <div key={src} className="relative h-full w-full shrink-0 snap-start overflow-hidden">
                {(i === 0 || armed) && (
                  <Image
                    src={src}
                    alt={i === 0 ? `${p.titulo}, ${p.barrio}` : ""}
                    fill
                    sizes={sizes}
                    priority={priority && i === 0}
                    placeholder={p.blur[src] ? "blur" : "empty"}
                    blurDataURL={p.blur[src]}
                    className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover/card:scale-[1.06]"
                  />
                )}
              </div>
            ))}
          </div>
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ink backdrop-blur">{OPERACION_LABEL[p.operacion]}</span>
          {p.estado === "reservada" && <span className="rounded-full bg-ink px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-naranja">Reservada</span>}
          {p.aEstrenar && p.estado !== "reservada" && <span className="rounded-full bg-naranja px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ink">A estrenar</span>}
        </div>
        <div className="absolute right-3 top-3">
          <FavoriteButton id={p.id} title={p.titulo} />
        </div>

        {/* Controles del mini carrusel */}
        {fotos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 opacity-0 shadow-md transition-opacity duration-300 hover:bg-white focus-visible:opacity-100 group-hover/card:opacity-100 max-md:hidden"
            >
              <Icon name="chevron-left" size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 opacity-0 shadow-md transition-opacity duration-300 hover:bg-white focus-visible:opacity-100 group-hover/card:opacity-100 max-md:hidden"
            >
              <Icon name="chevron" size={18} />
            </button>
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden="true">
              {fotos.map((f, i) => (
                <span key={f} className={clsx("h-1.5 rounded-full bg-white transition-all duration-500", i === idx ? "w-5 opacity-100" : "w-1.5 opacity-60")} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className={clsx("transition-transform duration-700 ease-[var(--ease-expo)]", !isList && "pt-5 group-hover/card:-translate-y-1")}>
        <p className="eyebrow text-gris-text">{meta}</p>
        <h3 className={clsx("mt-2.5 font-medium leading-snug tracking-tight text-ink", isList ? "text-xl" : "text-lg")}>
          <Link href={p.href} className="outline-none hover:text-naranja-text focus-visible:underline">
            {p.titulo}
          </Link>
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gris-text">
          <Icon name="pin" size={15} className="shrink-0" />
          <span className="truncate">
            {p.direccion} · {p.barrio}
          </span>
        </p>
        <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-ink/80" aria-label="Características">
          {p.m2 && (
            <li className="inline-flex items-center gap-1.5">
              <Icon name="area" size={16} className="text-gris" /> {formatM2(p.m2)}
            </li>
          )}
          {p.ambientes && (
            <li className="inline-flex items-center gap-1.5">
              <Icon name="rooms" size={16} className="text-gris" /> {p.ambientes} amb.
            </li>
          )}
          {p.dormitorios && (
            <li className="inline-flex items-center gap-1.5">
              <Icon name="bed" size={16} className="text-gris" /> {p.dormitorios} dorm.
            </li>
          )}
          {p.banos && (
            <li className="inline-flex items-center gap-1.5">
              <Icon name="bath" size={16} className="text-gris" /> {p.banos} {p.banos === 1 ? "baño" : "baños"}
            </li>
          )}
        </ul>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-t border-ink/10 pt-4">
          <p className="text-xl font-semibold tracking-tight tabular-nums">{formatPrice(p.precio, p.moneda)}</p>
          <Link href={p.href} className="relative z-[1] inline-flex items-center gap-1.5 text-[13px] font-semibold text-naranja-text max-sm:hidden">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover/card:bg-[length:100%_1px]">
              {isList ? "Más detalles" : "Ver propiedad"}
            </span>
            <Icon name="arrow" size={16} className="transition-transform duration-500 group-hover/card:translate-x-1" />
          </Link>
        </div>
        {isList && (
          <div className="mt-3">
            <CompareButton id={p.id} compact />
          </div>
        )}
      </div>
    </article>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="skeleton aspect-[4/3] rounded-[var(--radius-card)]" />
      <div className="skeleton mt-5 h-3 w-28 rounded" />
      <div className="skeleton mt-3 h-5 w-4/5 rounded" />
      <div className="skeleton mt-2 h-4 w-3/5 rounded" />
      <div className="skeleton mt-6 h-6 w-36 rounded" />
    </div>
  );
}
