"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";

/** Descripción real con "Leer más" (texto completo en el HTML para SEO; solo se recorta visualmente). */
export function Description({ parrafos }: { parrafos: string[] }) {
  const [open, setOpen] = useState(false);
  const long = parrafos.join(" ").length > 650;
  return (
    <div>
      <motion.div
        initial={false}
        animate={{ height: open || !long ? "auto" : 280 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden"
        id="descripcion-texto"
      >
        <div className="space-y-4 text-[16px] leading-[1.75] text-ink/85">
          {parrafos.map((t, i) => (
            <p key={i} className={t.startsWith("•") ? "pl-1" : undefined}>
              {t}
            </p>
          ))}
        </div>
        {long && !open && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-crema to-transparent" />}
      </motion.div>
      {long && (
        <button
          type="button"
          aria-expanded={open}
          aria-controls="descripcion-texto"
          onClick={() => setOpen((o) => !o)}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-naranja-text hover:underline"
        >
          {open ? "Leer menos" : "Leer más"}
          <Icon name="chevron-down" size={16} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
        </button>
      )}
    </div>
  );
}
