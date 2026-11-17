/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getAllProperties, getPropertyById } from "@/lib/properties";
import { formatM2, formatPrice } from "@/lib/format";
import { OPERACION_LABEL } from "@/lib/properties/filters";
import { SITE } from "@/lib/site";
import { PrintBar, PrintAsesor } from "@/components/ficha/PrintBar";

export const revalidate = 3600;
export const metadata: Metadata = { robots: { index: false, follow: false } };

export async function generateStaticParams() {
  return (await getAllProperties()).map((p) => ({ id: String(p.id) }));
}

/** Versión imprimible de la ficha (Guardar como PDF) con logo, fotos y datos. Pensada para asesores. */
export default async function FichaPDF({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getPropertyById(Number(id));
  if (!p) notFound();
  const facts = [
    ["Tipo", p.tipo],
    ["Ambientes", p.ambientes],
    ["Dormitorios", p.dormitorios],
    ["Baños", p.banos],
    ["Cocheras", p.cocheras],
    ["Sup. total", formatM2(p.m2_totales)],
    ["Sup. cubierta", formatM2(p.m2_cubiertos)],
    ["Antigüedad", p.antiguedad],
    ["Orientación", p.orientacion],
    ["Expensas", p.expensas ? formatPrice(p.expensas, "$") : null],
  ].filter(([, v]) => v != null && v !== "");
  const chips = Array.from(new Set([...p.features.map((f) => f.label), ...p.amenities_servicios]));

  return (
    <div className="min-h-screen bg-white">
      <PrintBar href={p.href} />
      <div className="mx-auto max-w-[210mm] px-[10mm] py-[8mm] text-ink print:px-0 print:py-0">
        <header className="flex items-center justify-between border-b-4 border-naranja pb-4">
          <img src="/marca/logo-bellagamba.svg" alt="Bellagamba" width={153} height={20} className="w-44" />
          <div className="text-right text-[11px] leading-tight text-gris-text">
            <p>{SITE.address.street}, {SITE.address.city}</p>
            <p>
              Tel. {SITE.phone} · WhatsApp {SITE.whatsappDisplay}
            </p>
            <p>{SITE.email} · bellagamba.com</p>
          </div>
        </header>

        <section className="avoid-break mt-6 flex items-start justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-naranja-text">
              {OPERACION_LABEL[p.operacion]} · {p.tipo} · ID {p.id}
            </p>
            <h1 className="mt-2 text-[26px] font-light leading-tight tracking-tight">{p.titulo}</h1>
            <p className="mt-1 text-[13px] text-gris-text">
              {p.direccion} · {p.barrio}, {p.localidad}
            </p>
          </div>
          <p className="shrink-0 rounded-xl bg-ink px-4 py-3 text-[22px] font-semibold text-white">{formatPrice(p.precio, p.moneda)}</p>
        </section>

        <section className="avoid-break mt-5 grid grid-cols-3 grid-rows-2 gap-2">
          <img src={p.fotos[0]} alt={p.titulo} className="col-span-2 row-span-2 h-[92mm] w-full rounded-lg object-cover" />
          {p.fotos.slice(1, 3).map((f) => (
            <img key={f} src={f} alt="" className="h-[45mm] w-full rounded-lg object-cover" />
          ))}
        </section>

        <section className="avoid-break mt-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gris-text">Datos clave</h2>
          <dl className="mt-2 grid grid-cols-5 gap-px overflow-hidden rounded-lg bg-ink/10 text-[12px]">
            {facts.map(([k, v]) => (
              <div key={k as string} className="bg-crema px-3 py-2">
                <dt className="text-[10px] text-gris-text">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gris-text">Descripción</h2>
          <div className="mt-2 columns-2 gap-6 space-y-2 text-[11.5px] leading-relaxed text-ink/85">
            {p.parrafos.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        </section>

        {chips.length > 0 && (
          <section className="avoid-break mt-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gris-text">Características y servicios</h2>
            <p className="mt-2 text-[11.5px]">{chips.join(" · ")}</p>
          </section>
        )}

        {p.fotos.length > 3 && (
          <section className="print-break mt-6 grid grid-cols-3 gap-2">
            {p.fotos.slice(3, 12).map((f) => (
              <img key={f} src={f} alt="" className="h-[48mm] w-full rounded-lg object-cover" />
            ))}
          </section>
        )}

        <footer className="avoid-break mt-6 flex items-end justify-between gap-6 border-t border-ink/10 pt-4">
          <div>
            <Suspense fallback={<p className="text-[13px] font-semibold">Tu asesor Bellagamba</p>}>
              <PrintAsesor />
            </Suspense>
            <p className="text-[11px] text-gris-text">
              Ficha online: {SITE.url.replace(/^https?:\/\//, "")}
              {p.href}
            </p>
          </div>
          <div className="max-w-[95mm] text-right text-[9px] leading-snug text-gris-text">
            <p>{SITE.disclaimer}</p>
            <p className="mt-1">
              {SITE.legalName} · {SITE.matriculas}
            </p>
          </div>
        </footer>
        <p className="no-print mt-10 text-center text-sm text-gris-text">
          <Link href={p.href} className="underline underline-offset-4">
            Volver a la ficha
          </Link>
        </p>
      </div>
    </div>
  );
}
