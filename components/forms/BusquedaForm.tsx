"use client";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { AMBIENTES_OPC, TIPOS_BUSQUEDA, busquedaPaso1, busquedaSchema } from "@/lib/forms/schemas";
import { Input, Textarea, ChipGroup, Honeypot, SubmitButton, FormError, SuccessScreen, useSubmit } from "./fields";
import { Stepper } from "./Stepper";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { waLink } from "@/lib/site";
import { searchesStore } from "@/lib/store";
import { track } from "@/lib/analytics";

type D = z.infer<typeof busquedaSchema>;

function summary(d: Partial<D>) {
  const lines = [
    `Operación: ${d.operacion ?? "-"}`,
    `Tipo: ${(d.tipos || []).join(", ") || "-"}`,
    `Zonas: ${(d.zonas || []).join(", ") || "-"}`,
    `Ambientes: ${(d.ambientes || []).join(", ") || "-"}`,
    `Presupuesto: ${d.presupuesto ? `${d.moneda} ${Number(String(d.presupuesto).replace(/\./g, "")).toLocaleString("es-AR")}` : "-"}`,
  ];
  return lines.join("\n");
}

/** "Buscamos la propiedad por vos": 2 pasos + alternativa WhatsApp + alerta guardada */
export function BusquedaForm({ zonas }: { zonas: string[] }) {
  const [step, setStep] = useState(0);
  const { status, error, submit, reset: resetStatus } = useSubmit("busqueda");
  const { register, handleSubmit, formState, control, trigger, reset, watch, getValues } = useForm<D>({
    resolver: zodResolver(step === 0 ? busquedaPaso1 : busquedaSchema) as never,
    defaultValues: { moneda: "USD", tipos: [], zonas: [], ambientes: [], alerta: true },
    mode: "onTouched",
  });
  const e = formState.errors;
  const vals = watch();

  const next = async () => {
    const ok = await trigger(Object.keys(busquedaPaso1.shape) as (keyof D)[]);
    if (ok) setStep(1);
  };

  const onSubmit = async (d: D) => {
    const ok = await submit(d);
    if (ok && d.alerta) {
      const q = new URLSearchParams();
      if (d.operacion) q.set("operacion", d.operacion === "Compra" ? "venta" : "alquiler");
      if (d.tipos.length) q.set("tipo", d.tipos.join(","));
      if (d.zonas.length) q.set("barrio", d.zonas.join(","));
      if (d.moneda === "USD" && d.presupuesto) q.set("precio_max", String(d.presupuesto).replace(/\./g, ""));
      searchesStore.set((prev) => [
        { id: String(Date.now()), label: `${d.tipos.join("/")} en ${d.zonas.slice(0, 2).join(", ")}`, query: q.toString(), path: "/inmobiliaria/propiedades", alerta: true, email: d.email, createdAt: new Date().toISOString() },
        ...prev,
      ]);
    }
    track("search", { origen: "busqueda_personalizada" });
  };

  if (status === "success")
    return (
      <SuccessScreen title="¡Recibimos tu búsqueda!" text={`Gracias ${getValues("nombre")?.split(" ")[0] ?? ""}. Ya estamos buscando por vos, incluso entre propiedades que todavía no se publicaron.${getValues("alerta") ? " Además activamos tu alerta: te avisamos cuando entre algo así." : ""}`}>
        <ButtonLink href="/inmobiliaria/propiedades" arrow>
          Ver propiedades
        </ButtonLink>
        <ButtonLink href="/inmobiliaria" variant="outline">
          Volver al inicio
        </ButtonLink>
        <button
          type="button"
          onClick={() => {
            reset();
            setStep(0);
            resetStatus();
          }}
          className="inline-flex h-12 items-center gap-2 px-2 text-sm font-semibold text-gris-text hover:text-ink"
        >
          <Icon name="plus" size={16} /> Nueva búsqueda
        </button>
      </SuccessScreen>
    );

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="relative">
      <Stepper steps={["¿Qué estás buscando?", "¿Cómo te contactamos?"]} current={step} />
      <Honeypot {...register("website")} />
      <AnimatePresence mode="wait" initial={false}>
        {step === 0 ? (
          <motion.div key="s0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }} className="grid gap-7">
            <Controller control={control} name="operacion" render={({ field }) => <ChipGroup label="Operación" options={["Compra", "Alquiler"]} value={field.value} onChange={field.onChange} error={e.operacion?.message} />} />
            <Controller control={control} name="tipos" render={({ field }) => <ChipGroup multiple label="Tipo de propiedad (podés elegir varios)" options={TIPOS_BUSQUEDA} value={field.value} onChange={field.onChange} error={e.tipos?.message} />} />
            <Controller control={control} name="zonas" render={({ field }) => <ChipGroup multiple label="Zona / barrio" options={zonas} value={field.value} onChange={field.onChange} error={e.zonas?.message} />} />
            <Controller control={control} name="ambientes" render={({ field }) => <ChipGroup multiple label="Ambientes" options={AMBIENTES_OPC} value={field.value} onChange={field.onChange} error={e.ambientes?.message} />} />
            <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
              <Controller control={control} name="moneda" render={({ field }) => <ChipGroup label="Moneda" options={["USD", "ARS"]} value={field.value} onChange={field.onChange} />} />
              <div className="sm:pt-7">
                <Input label={`Presupuesto máximo (${vals.moneda})`} inputMode="numeric" {...register("presupuesto")} error={e.presupuesto?.message} />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={next} className="group inline-flex h-14 items-center gap-3 rounded-full bg-naranja px-8 text-[15px] font-semibold text-ink transition-colors hover:bg-ink hover:text-white">
                Continuar <Icon name="arrow" size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href={waLink(`Hola Bellagamba! Quiero que me ayuden a buscar una propiedad:\n${summary(vals)}`)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("click_whatsapp", { origen: "busqueda_personalizada" })}
                className="inline-flex h-14 items-center gap-2.5 rounded-full bg-[#187a42] px-6 text-[15px] font-semibold text-white hover:bg-[#11643a]"
              >
                <WhatsAppIcon size={18} /> Enviar por WhatsApp
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.35 }} className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-crema p-4 text-sm leading-relaxed sm:col-span-2">
              <p className="eyebrow mb-2 text-gris-text">Tu búsqueda</p>
              <p className="whitespace-pre-line">{summary(vals)}</p>
            </div>
            <Input label="Nombre y apellido" autoComplete="name" {...register("nombre")} error={e.nombre?.message} className="sm:col-span-2" />
            <Input label="Email" type="email" autoComplete="email" {...register("email")} error={e.email?.message} />
            <Input label="Teléfono" type="tel" inputMode="tel" autoComplete="tel" {...register("telefono")} error={e.telefono?.message} />
            <Textarea label="Algo más que debamos saber (opcional)" rows={3} {...register("mensaje")} className="sm:col-span-2" />
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-ink/10 bg-white p-4 sm:col-span-2">
              <input type="checkbox" {...register("alerta")} className="mt-0.5 size-5 accent-[#ef7208]" />
              <span className="text-sm">
                <strong className="flex items-center gap-1.5 font-semibold">
                  <Icon name="bell" size={16} /> Avisame cuando entre algo así
                </strong>
                <span className="text-gris-text">Guardamos tu búsqueda como alerta y te escribimos apenas ingrese una propiedad que coincida.</span>
              </span>
            </label>
            <div className="sm:col-span-2">
              <FormError error={error} />
            </div>
            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button type="button" onClick={() => setStep(0)} className="inline-flex h-14 items-center gap-2 rounded-full border border-ink/15 px-6 text-sm font-semibold hover:border-ink">
                <Icon name="arrow-left" size={16} /> Volver
              </button>
              <SubmitButton status={status}>Enviar búsqueda</SubmitButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
