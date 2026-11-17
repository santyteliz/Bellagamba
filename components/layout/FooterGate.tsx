"use client";
import { usePathname } from "next/navigation";

/** Oculta el footer en la intro (/) y en la versión imprimible de la ficha. */
export function FooterGate({ children }: { children: React.ReactNode }) {
  const p = usePathname();
  if (p === "/" || p.startsWith("/ficha-pdf")) return null;
  return <>{children}</>;
}
