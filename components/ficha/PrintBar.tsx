"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useAsesor } from "./useFicha";

export function PrintBar({ href }: { href: string }) {
  useEffect(() => {
    // Abre el diálogo de impresión (Guardar como PDF) cuando terminan de cargar las fotos
    const go = () => setTimeout(() => window.print(), 400);
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => window.removeEventListener("load", go);
  }, []);
  return (
    <div className="no-print sticky top-0 z-10 flex items-center justify-between gap-3 bg-ink px-4 py-3 text-white">
      <Link href={href} className="inline-flex items-center gap-2 text-sm font-semibold">
        <Icon name="arrow-left" size={16} /> Volver a la ficha
      </Link>
      <button type="button" onClick={() => window.print()} className="inline-flex h-10 items-center gap-2 rounded-full bg-naranja px-5 text-sm font-semibold text-ink">
        <Icon name="printer" size={16} /> Imprimir / Guardar PDF
      </button>
    </div>
  );
}

export function PrintAsesor() {
  useSearchParams();
  const asesor = useAsesor();
  return <p className="text-[13px] font-semibold">{asesor ? `Asesor/a: ${asesor}` : "Tu asesor Bellagamba"}</p>;
}
