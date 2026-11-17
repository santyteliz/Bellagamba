"use client";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useEffect, useState } from "react";
import type { PropertyCard as Card } from "@/lib/properties/types";
import { compareStore, favoritesStore, COMPARE_MAX } from "@/lib/store";
import { formatM2, formatPrice } from "@/lib/format";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { SITE, waLink } from "@/lib/site";

type Row = { label: string; get: (p: Card) => string | number | null | undefined; best?: "min" | "max"; num?: (p: Card) => number | null };

const ROWS: Row[] = [
  { label: "Precio", get: (p) => formatPrice(p.precio, p.moneda), best: "min", num: (p) => p.precio },
  { label: "USD / m²", get: (p) => (p.precio && p.m2 ? `USD ${Math.round(p.precio / p.m2).toLocaleString("es-AR")}` : null), best: "min", num: (p) => (p.precio && p.m2 ? p.precio / p.m2 : null) },
  { label: "Tipo", get: (p) => p.tipo },
  { label: "Barrio", get: (p) => `${p.barrio}, ${p.localidad}` },
  { label: "Superficie", get: (p) => formatM2(p.m2), best: "max", num: (p) => p.m2 },
  { label: "Sup. cubierta", get: (p) => formatM2(p.m2_cubiertos), best: "max", num: (p) => p.m2_cubiertos },
  { label: "Ambientes", get: (p) => p.ambientes, best: "max", num: (p) => p.ambientes },
  { label: "Dormitorios", get: (p) => p.dormitorios, best: "max", num: (p) => p.dormitorios },
  { label: "Baños", get: (p) => p.banos, best: "max", num: (p) => p.banos },
  { label: "Estado", get: (p) => (p.estado === "reservada" ? "Reservada" : "Disponible") },
];

export function CompareView({ cards }: { cards: Card[] }) {
  const ids = compareStore.use();
  const favs = favoritesStore.use();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const list = ids.map((id) => cards.find((c) => c.id === id)).filter(Boolean) as Card[];
  const allFeatures = [...new Set(list.flatMap((p) => p.features.map((f) => f.label)))];
  const suggestions = (favs.length ? favs.map((id) => cards.find((c) => c.id === id)) : cards.filter((c) => c.destacada)).filter((c): c is Card => !!c && !ids.includes(c.id)).slice(0, 6);

  if (!mounted) return <div className="container-x min-h-[50vh]" />;
  return (
    <div className="container-x pb-28">
      {list.length === 0 ? (
        <div className="rounded-[var(--radius-card)] bg-white px-6 py-20 text-center ring-1 ring-ink/5">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-naranja-50 text-naranja-text">
            <Icon name="compare" size={26} />
          </span>
          <p className="mx-auto mt-8 max-w-md text-h3 font-light">Elegí hasta {COMPARE_MAX} propiedades para comparar.</p>
          <p className="mx-auto mt-3 max-w-md text-gris-text">Usá el botón “Comparar” en el listado o en cada ficha.</p>
        </div>
      ) : (
        <div className="no-scrollbar -mx-4 overflow-x-auto px-4" data-lenis-prevent>
          <table className="w-full min-w-[720px] border-separate border-spacing-x-3 text-left">
            <caption className="sr-only">Comparación de propiedades</caption>
            <thead>
              <tr>
                <th scope="col" className="w-40 align-bottom text-[12px] font-semibold uppercase tracking-[0.12em] text-gris-text">
                  {list.length}/{COMPARE_MAX} propiedades
                </th>
                {list.map((p) => (
                  <th key={p.id} scope="col" className="align-top font-normal" style={{ width: `${100 / COMPARE_MAX}%` }}>
                    <div className="relative overflow-hidden rounded-2xl bg-white ring-1 ring-ink/5">
                      <div className="relative aspect-[4/3]">
                        <Image src={p.foto_portada} alt={p.titulo} fill sizes="320px" className="object-cover" />
                      </div>
                      <button type="button" onClick={() => compareStore.set((prev) => prev.filter((x) => x !== p.id))} aria-label={`Quitar ${p.titulo} del comparador`} className="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-white/90 hover:bg-white">
                        <Icon name="close" size={16} />
                      </button>
                      <div className="p-4">
                        <Link href={p.href} className="line-clamp-2 font-medium hover:text-naranja-text">
                          {p.titulo}
                        </Link>
                      </div>
                    </div>
                  </th>
                ))}
                {Array.from({ length: COMPARE_MAX - list.length }).map((_, i) => (
                  <th key={`e${i}`} scope="col" className="align-top">
                    <Link href="/inmobiliaria/propiedades" className="grid aspect-[4/3] place-items-center rounded-2xl border border-dashed border-ink/20 text-sm font-semibold text-gris-text hover:border-ink hover:text-ink">
                      <span className="flex flex-col items-center gap-2">
                        <Icon name="plus" size={22} /> Agregar propiedad
                      </span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => {
                const nums = r.num ? list.map((p) => r.num!(p)).filter((n): n is number => n != null) : [];
                const best = r.best && nums.length > 1 ? (r.best === "min" ? Math.min(...nums) : Math.max(...nums)) : null;
                return (
                  <tr key={r.label}>
                    <th scope="row" className="border-b border-ink/10 py-4 text-[13px] font-semibold text-gris-text">
                      {r.label}
                    </th>
                    {list.map((p) => {
                      const v = r.get(p);
                      const isBest = best != null && r.num?.(p) === best;
                      return (
                        <td key={p.id} className={clsx("border-b border-ink/10 py-4 text-[15px]", isBest && "font-semibold")}>
                          {v ?? <span className="text-gris">—</span>}
                          {isBest && <span className="ml-2 rounded-full bg-naranja px-2 py-0.5 text-[10px] font-bold uppercase text-ink">Mejor</span>}
                        </td>
                      );
                    })}
                    {Array.from({ length: COMPARE_MAX - list.length }).map((_, i) => (
                      <td key={i} className="border-b border-ink/10" />
                    ))}
                  </tr>
                );
              })}
              {allFeatures.map((f) => (
                <tr key={f}>
                  <th scope="row" className="border-b border-ink/10 py-3 text-[13px] font-semibold text-gris-text">
                    {f}
                  </th>
                  {list.map((p) => (
                    <td key={p.id} className="border-b border-ink/10 py-3">
                      {p.features.some((x) => x.label === f) ? <><Icon name="check" size={18} strokeWidth={2} className="text-naranja-text" /><span className="sr-only">Sí</span></> : <span className="text-gris">—</span>}
                    </td>
                  ))}
                  {Array.from({ length: COMPARE_MAX - list.length }).map((_, i) => (
                    <td key={i} className="border-b border-ink/10" />
                  ))}
                </tr>
              ))}
              <tr>
                <td />
                {list.map((p) => (
                  <td key={p.id} className="pt-6">
                    <div className="flex flex-col gap-2">
                      <ButtonLink href={p.href} size="sm" variant="dark">
                        Ver ficha
                      </ButtonLink>
                      <ButtonLink href={waLink(`Hola Bellagamba! Me interesa ${p.titulo}. ${SITE.url}${p.href}`)} size="sm" variant="whatsapp" icon={<WhatsAppIcon size={15} />}>
                        Consultar
                      </ButtonLink>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {list.length < COMPARE_MAX && suggestions.length > 0 && (
        <section className="mt-20">
          <h2 className="text-xl font-medium">{favs.length ? "Desde tus favoritos" : "Sugerencias"}</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((p) => (
              <li key={p.id} className="flex items-center gap-4 rounded-2xl bg-white p-3 ring-1 ring-ink/5">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                  <Image src={p.foto_portada} alt="" fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.titulo}</p>
                  <p className="text-[13px] text-gris-text">{formatPrice(p.precio, p.moneda)}</p>
                </div>
                <button type="button" onClick={() => compareStore.set((prev) => (prev.length < COMPARE_MAX ? [...prev, p.id] : prev))} className="inline-flex h-9 items-center gap-1 rounded-full bg-ink px-3 text-[12px] font-semibold text-white hover:bg-naranja hover:text-ink">
                  <Icon name="plus" size={14} /> Sumar
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
