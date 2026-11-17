"use client";
import clsx from "clsx";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ETAPAS, type Desarrollo, type Etapa } from "@/lib/desarrollos";
import { DevCard } from "./DevCard";

/** Desarrollos por etapa (en pozo, en obra, terminados) con pestañas */
export function DevGrid({ items, hrefs, dark }: { items: Desarrollo[]; hrefs: Record<string, string | undefined>; dark?: boolean }) {
  const [tab, setTab] = useState<Etapa | "todos">("todos");
  const list = tab === "todos" ? items : items.filter((d) => d.etapa === tab);
  return (
    <div>
      <div role="tablist" aria-label="Etapa" className={clsx("inline-flex flex-wrap rounded-full p-1", dark ? "bg-white/10" : "bg-white ring-1 ring-ink/5")}>
        {[{ value: "todos" as const, label: "Todos" }, ...ETAPAS].map((e) => (
          <button
            key={e.value}
            role="tab"
            type="button"
            aria-selected={tab === e.value}
            onClick={() => setTab(e.value)}
            className={clsx("relative h-10 rounded-full px-5 text-sm font-semibold transition-colors", tab === e.value ? (dark ? "text-ink" : "text-white") : dark ? "text-white/80 hover:text-white" : "text-ink/70 hover:text-ink")}
          >
            {tab === e.value && <motion.span layoutId={`dev-pill-${dark ? "d" : "l"}`} className={clsx("absolute inset-0 rounded-full", dark ? "bg-naranja" : "bg-ink")} transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
            <span className="relative">
              {e.label} <span className="opacity-60">{e.value === "todos" ? items.length : items.filter((d) => d.etapa === e.value).length}</span>
            </span>
          </button>
        ))}
      </div>
      <motion.div layout className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((d) => (
            <motion.div key={d.slug} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <DevCard d={d} href={hrefs[d.slug]} dark={dark} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 && (
        <p className={clsx("mt-12 rounded-2xl border border-dashed p-10 text-center", dark ? "border-white/20 text-white/70" : "border-ink/15 text-gris-text")}>
          No hay desarrollos cargados en esta etapa todavía. [CONFIRMAR etapas de Mill3, Drei, Emme, Doc y Dream]
        </p>
      )}
    </div>
  );
}
