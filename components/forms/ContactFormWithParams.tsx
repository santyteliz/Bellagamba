"use client";
import { useSearchParams } from "next/navigation";
import { ContactForm } from "./ContactForm";
import type { ASUNTOS } from "@/lib/forms/schemas";

const MAP: Record<string, (typeof ASUNTOS)[number]> = {
  vender: "Quiero vender",
  alquilar: "Quiero alquilar mi propiedad",
  tasacion: "Tasación",
  busco: "Busco propiedad",
  consulta: "Consulta general",
};

/** Preselecciona el asunto desde ?asunto=vender|alquilar|tasacion|busco */
export function ContactFormWithParams() {
  const a = useSearchParams().get("asunto");
  return <ContactForm key={a ?? "x"} defaultAsunto={a ? MAP[a] : undefined} />;
}
