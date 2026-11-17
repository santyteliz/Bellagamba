/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";

/** Logo oficial (SVG de insumos/marca). variant: color (naranja + punto verde), blanco, negro. */
export function Logo({ variant = "color", className, priority }: { variant?: "color" | "blanco" | "negro"; className?: string; priority?: boolean }) {
  const src = variant === "color" ? "/marca/logo-bellagamba.svg" : `/marca/logo-bellagamba-${variant}.svg`;
  return (
    <img
      src={src}
      alt="Bellagamba Marketing Inmobiliario"
      width={153}
      height={20}
      className={clsx("h-auto", className)}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}

/** Isotipo Shulbius: líneas verticales (interpretación tipográfica, reemplazar por el SVG oficial cuando lo pasen). */
export function ShulbiusMark({ className }: { className?: string }) {
  const bars = [0.45, 0.8, 1, 0.65, 0.9, 0.55, 0.75];
  return (
    <svg viewBox="0 0 70 60" className={className} aria-hidden="true">
      {bars.map((h, i) => (
        <rect key={i} x={i * 10 + 3} y={60 - 60 * h} width="1.6" height={60 * h} fill="currentColor" />
      ))}
    </svg>
  );
}
