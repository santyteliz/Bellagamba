"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { FavoriteButton } from "@/components/property/FavoriteButton";
import { CompareButton } from "@/components/property/CompareButton";
import { SITE } from "@/lib/site";
import { formatPrice } from "@/lib/format";
import { track } from "@/lib/analytics";
import { toast } from "@/lib/store";

interface P {
  id: number;
  titulo: string;
  precio: number | null;
  moneda: string;
  href: string;
  barrio: string;
}

export function FichaActions({ p }: { p: P }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <FavoriteButton id={p.id} title={p.titulo} variant="inline" />
      <ShareMenu p={p} />
      <CompareButton id={p.id} />
      <Link
        href={`/ficha-pdf/${p.id}`}
        target="_blank"
        data-no-transition
        className="inline-flex h-12 items-center gap-2 rounded-full border border-ink/15 px-5 text-sm font-semibold transition-colors hover:border-ink"
      >
        <Icon name="download" size={16} /> Ficha PDF
      </Link>
    </div>
  );
}

function ShareMenu({ p }: { p: P }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const url = `${SITE.url}${p.href}`;
  const text = `${p.titulo} · ${formatPrice(p.precio, p.moneda)} · ${p.barrio}`;

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("click", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const native = async () => {
    try {
      await navigator.share({ title: p.titulo, text, url });
      track("share", { method: "native", item_id: p.id });
    } catch {
      /* cancelado */
    }
    setOpen(false);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copiado");
      track("share", { method: "copy", item_id: p.id });
    } catch {
      toast("No se pudo copiar el link");
    }
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-12 items-center gap-2 rounded-full border border-ink/15 px-5 text-sm font-semibold transition-colors hover:border-ink"
      >
        <Icon name="share" size={16} /> Compartir
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full z-30 mt-2 w-60 origin-top-left rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-ink/5"
          >
            <a
              role="menuitem"
              href={`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => (track("share", { method: "whatsapp", item_id: p.id }), setOpen(false))}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-crema"
            >
              <WhatsAppIcon size={18} className="text-[#187a42]" /> Enviar por WhatsApp
            </a>
            <button role="menuitem" type="button" onClick={copy} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-crema">
              <Icon name="link" size={18} /> Copiar link
            </button>
            <a
              role="menuitem"
              href={`mailto:?subject=${encodeURIComponent(p.titulo)}&body=${encodeURIComponent(`${text}\n${url}`)}`}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-crema"
            >
              <Icon name="mail" size={18} /> Enviar por email
            </a>
            {typeof navigator !== "undefined" && "share" in navigator && (
              <button role="menuitem" type="button" onClick={native} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-crema">
                <Icon name="share" size={18} /> Más opciones…
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
