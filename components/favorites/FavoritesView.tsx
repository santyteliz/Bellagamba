"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { PropertyCard as Card } from "@/lib/properties/types";
import { favoritesStore, recentStore, searchesStore } from "@/lib/store";
import { PropertyCard } from "@/components/property/PropertyCard";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { SITE, waLink } from "@/lib/site";

export function FavoritesView({ cards }: { cards: Card[] }) {
  const favs = favoritesStore.use();
  const recents = recentStore.use();
  const searches = searchesStore.use();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const list = favs.map((id) => cards.find((c) => c.id === id)).filter(Boolean) as Card[];
  const recent = recents.filter((id) => !favs.includes(id)).map((id) => cards.find((c) => c.id === id)).filter(Boolean) as Card[];
  const shareMsg = `Hola Bellagamba! Me interesan estas propiedades:\n${list.map((p) => `• ${p.titulo} ${SITE.url}${p.href}`).join("\n")}`;

  if (!mounted) return <div className="container-x min-h-[50vh]" />;
  return (
    <div className="container-x pb-28">
      {list.length === 0 ? (
        <div className="rounded-[var(--radius-card)] bg-white px-6 py-20 text-center ring-1 ring-ink/5">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-naranja-50 text-naranja-text">
            <Icon name="heart" size={26} />
          </span>
          <p className="mx-auto mt-8 max-w-md text-h3 font-light">Todavía no guardaste propiedades.</p>
          <p className="mx-auto mt-3 max-w-md text-gris-text">Tocá el corazón en cualquier propiedad para guardarla acá y compararla después.</p>
          <ButtonLink href="/inmobiliaria/propiedades" arrow className="mt-8">
            Explorar propiedades
          </ButtonLink>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-gris-text">
              {list.length} {list.length === 1 ? "propiedad guardada" : "propiedades guardadas"} en este dispositivo
            </p>
            <div className="flex flex-wrap gap-2">
              <ButtonLink href={waLink(shareMsg)} variant="whatsapp" size="sm" icon={<WhatsAppIcon size={16} />}>
                Consultar por todas
              </ButtonLink>
              <ButtonLink href="/inmobiliaria/comparar" variant="outline" size="sm" icon={<Icon name="compare" size={16} />}>
                Ir al comparador
              </ButtonLink>
              <button type="button" onClick={() => favoritesStore.set([])} className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold text-gris-text hover:text-ink">
                <Icon name="trash" size={15} /> Vaciar
              </button>
            </div>
          </div>
          <motion.div layout className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {list.map((p) => (
                <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                  <PropertyCard p={p} layout="grid" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      )}

      <section id="busquedas" aria-labelledby="bus-t" className="mt-24 scroll-mt-28">
        <h2 id="bus-t" className="text-h3 font-light">
          Búsquedas guardadas y <span className="text-naranja-text">alertas</span>
        </h2>
        {searches.length === 0 ? (
          <p className="mt-4 text-gris-text">
            Guardá una búsqueda desde el{" "}
            <Link href="/inmobiliaria/propiedades" className="font-semibold text-ink underline underline-offset-4">
              listado
            </Link>{" "}
            y te avisamos cuando entre algo así.
          </p>
        ) : (
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {searches.map((s) => (
              <li key={s.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-ink/5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-crema">
                  <Icon name="bell" size={18} />
                </span>
                <Link href={`${s.path}${s.query ? `?${s.query}` : ""}`} className="min-w-0 flex-1">
                  <span className="block truncate font-medium first-letter:uppercase">{s.label || "Búsqueda guardada"}</span>
                  <span className="block text-[12px] text-gris-text">
                    {s.alerta ? "Alerta activa" : "Guardada"} · {new Date(s.createdAt).toLocaleDateString("es-AR")}
                  </span>
                </Link>
                <button type="button" aria-label="Eliminar búsqueda" onClick={() => searchesStore.set((prev) => prev.filter((x) => x.id !== s.id))} className="grid size-9 place-items-center rounded-full hover:bg-ink/5">
                  <Icon name="trash" size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {recent.length > 0 && (
        <section aria-labelledby="rec-t" className="mt-24">
          <h2 id="rec-t" className="text-h3 font-light">
            Vistas <span className="text-naranja-text">recientemente</span>
          </h2>
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
            {recent.slice(0, 4).map((p) => (
              <PropertyCard key={p.id} p={p} sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 92vw" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
