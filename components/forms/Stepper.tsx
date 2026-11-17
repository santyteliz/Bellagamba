"use client";
import clsx from "clsx";
import { motion } from "framer-motion";

/** Barra de progreso de formularios de pasos */
export function Stepper({ steps, current, dark }: { steps: string[]; current: number; dark?: boolean }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between text-[12px] font-semibold uppercase tracking-[0.12em]">
        <span className={dark ? "text-white/70" : "text-gris-text"}>
          Paso {current + 1} de {steps.length}
        </span>
        <span className={dark ? "text-white" : "text-ink"}>{steps[current]}</span>
      </div>
      <div className={clsx("mt-3 h-1 overflow-hidden rounded-full", dark ? "bg-white/15" : "bg-ink/10")} role="progressbar" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={current + 1} aria-label="Progreso del formulario">
        <motion.div className="h-full rounded-full bg-naranja" initial={false} animate={{ width: `${((current + 1) / steps.length) * 100}%` }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
      </div>
    </div>
  );
}
