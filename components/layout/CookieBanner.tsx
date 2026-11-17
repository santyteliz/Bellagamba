"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { consentStore } from "@/lib/store";

export function CookieBanner() {
  const consent = consentStore.use();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const choose = (status: "all" | "necessary") => consentStore.set({ status, date: new Date().toISOString() });

  return (
    <AnimatePresence>
      {ready && !consent && (
        <motion.div
          role="dialog"
          aria-label="Preferencias de cookies"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="no-print fixed inset-x-3 bottom-3 z-[60] rounded-3xl bg-ink p-5 text-white shadow-2xl sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-sm sm:p-6"
        >
          <p className="text-[15px] font-medium">Usamos cookies 🍪</p>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            Las necesarias hacen funcionar el sitio (favoritos, comparador). Con tu permiso sumamos medición para mejorar la experiencia.{" "}
            <Link href="/politica-de-privacidad" className="underline underline-offset-4 hover:text-white">
              Más info
            </Link>
          </p>
          <div className="mt-5 flex gap-2">
            <button type="button" onClick={() => choose("all")} className="h-11 flex-1 rounded-full bg-naranja px-4 text-sm font-semibold text-ink transition-colors hover:bg-white">
              Aceptar todas
            </button>
            <button type="button" onClick={() => choose("necessary")} className="h-11 flex-1 rounded-full border border-white/25 px-4 text-sm font-semibold transition-colors hover:bg-white hover:text-ink">
              Solo necesarias
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
