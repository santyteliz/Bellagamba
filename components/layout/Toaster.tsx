"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useToasts } from "@/lib/store";

export function Toaster() {
  const toasts = useToasts();
  return (
    <div aria-live="polite" className="no-print pointer-events-none fixed inset-x-0 top-20 z-[70] flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ y: -20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="pointer-events-auto flex items-center gap-4 rounded-full bg-ink py-2.5 pl-5 pr-2.5 text-sm text-white shadow-2xl"
          >
            <span className="size-2 rounded-full bg-naranja" />
            <span>{t.text}</span>
            {t.action ? (
              <Link href={t.action.href} className="rounded-full bg-white/10 px-3.5 py-1.5 font-semibold transition-colors hover:bg-naranja hover:text-ink">
                {t.action.label}
              </Link>
            ) : (
              <span className="w-1" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
