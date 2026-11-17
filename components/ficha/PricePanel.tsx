"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { formatPrice } from "@/lib/format";
import { SITE, waLink } from "@/lib/site";
import { track } from "@/lib/analytics";
import { fichaWhatsAppMessage, useAsesor } from "./useFicha";

interface P {
  id: number;
  titulo: string;
  precio: number | null;
  moneda: string;
  href: string;
  estado: "disponible" | "reservada";
  operacion: string;
}

export function goToAgendar() {
  window.dispatchEvent(new CustomEvent("bg:agendar"));
  const el = document.getElementById("contacto-ficha");
  const lenis = (window as unknown as { __lenis?: { scrollTo(t: HTMLElement, o: object): void } }).__lenis;
  if (el) lenis ? lenis.scrollTo(el, { offset: -90 }) : el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Panel lateral sticky (desktop) con precio, WhatsApp y Agendar visita + card del asesor */
export function PricePanel({ p }: { p: P }) {
  const asesor = useAsesor();
  const msg = fichaWhatsAppMessage(p, asesor);
  return (
    <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[0_30px_80px_-40px_rgb(20_20_20/0.35)] ring-1 ring-ink/5 lg:p-7">
      <p className="eyebrow text-gris-text">Precio de {p.operacion}</p>
      <p className="mt-3 text-[2rem] font-semibold leading-none tracking-tight tabular-nums">{formatPrice(p.precio, p.moneda)}</p>
      <div className="mt-6 grid gap-2.5">
        <a
          href={waLink(msg)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("click_whatsapp", { origen: "ficha_panel", item_id: p.id })}
          className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-[#187a42] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#11643a]"
        >
          <WhatsAppIcon size={20} /> Consultar por WhatsApp
        </a>
        <button
          type="button"
          onClick={goToAgendar}
          className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-ink px-6 text-[15px] font-semibold text-white transition-colors hover:bg-naranja hover:text-ink"
        >
          <Icon name="calendar" size={18} /> Agendar visita
        </button>
      </div>
      <AdvisorCard asesor={asesor} className="mt-6 border-t border-ink/10 pt-6" />
    </div>
  );
}

export function AdvisorCard({ asesor, className }: { asesor: string | null; className?: string }) {
  const initials = asesor
    ? asesor
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
    : "B";
  return (
    <div className={clsx("flex items-center gap-4", className)}>
      <div className="relative grid size-14 shrink-0 place-items-center rounded-full bg-naranja text-lg font-semibold text-ink">
        {initials}
        <span className="absolute bottom-0.5 right-0.5 size-3 rounded-full bg-verde ring-2 ring-white" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-[15px] font-semibold">{asesor ?? "Tu asesor Bellagamba"}</p>
        <p className="text-[13px] text-gris-text">{asesor ? "Asesor/a inmobiliario/a · Bellagamba" : "Te respondemos en horario comercial"}</p>
        <a href={SITE.phoneHref} className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-semibold text-naranja-text hover:underline">
          <Icon name="phone" size={14} /> {SITE.phone}
        </a>
      </div>
    </div>
  );
}

/** Barra sticky inferior (mobile/tablet): precio + WhatsApp + Agendar */
export function MobileStickyBar({ p }: { p: P }) {
  const asesor = useAsesor();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 380);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "110%" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden"
        >
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-gris-text">{p.estado === "reservada" ? "Reservada" : "Precio"}</p>
              <p className="truncate text-lg font-semibold tabular-nums leading-tight">{formatPrice(p.precio, p.moneda)}</p>
            </div>
            <button type="button" onClick={goToAgendar} aria-label="Agendar visita" className="grid size-12 shrink-0 place-items-center rounded-full border border-ink/15">
              <Icon name="calendar" size={20} />
            </button>
            <a
              href={waLink(fichaWhatsAppMessage(p, asesor))}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("click_whatsapp", { origen: "ficha_barra", item_id: p.id })}
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-[#187a42] px-5 text-sm font-semibold text-white"
            >
              <WhatsAppIcon size={18} /> WhatsApp
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
