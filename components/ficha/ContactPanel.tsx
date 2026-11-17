"use client";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { consultaSchema, visitaSchema, FRANJAS } from "@/lib/forms/schemas";
import { Input, Textarea, Honeypot, SubmitButton, FormError, SuccessScreen, useSubmit, ChipGroup } from "@/components/forms/fields";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icon";
import { waLink } from "@/lib/site";
import { fichaWhatsAppMessage, useAsesor } from "./useFicha";

interface P {
  id: number;
  titulo: string;
  precio: number | null;
  moneda: string;
  href: string;
}

/** Formulario de consulta + Agendar visita (día y franja horaria) */
export function ContactPanel({ p }: { p: P }) {
  const [tab, setTab] = useState<"consulta" | "visita">("consulta");
  useEffect(() => {
    const on = () => setTab("visita");
    window.addEventListener("bg:agendar", on);
    return () => window.removeEventListener("bg:agendar", on);
  }, []);
  return (
    <section id="contacto-ficha" aria-labelledby="contacto-ficha-t" className="scroll-mt-28 rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-ink/5 sm:p-8">
      <h2 id="contacto-ficha-t" className="text-h3 font-light">
        ¿Te interesa? <span className="text-naranja-text">Hablemos.</span>
      </h2>
      <div role="tablist" aria-label="Tipo de contacto" className="mt-6 inline-flex rounded-full bg-crema p-1">
        {(
          [
            ["consulta", "Hacer una consulta"],
            ["visita", "Agendar visita"],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={clsx("relative h-11 rounded-full px-5 text-sm font-semibold transition-colors", tab === k ? "text-white" : "text-ink/70 hover:text-ink")}
          >
            {tab === k && <motion.span layoutId="ct-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
            <span className="relative">{l}</span>
          </button>
        ))}
      </div>
      <div className="mt-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            {tab === "consulta" ? <ConsultaForm p={p} /> : <VisitaForm p={p} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

type C = z.infer<typeof consultaSchema>;
function ConsultaForm({ p }: { p: P }) {
  const asesor = useAsesor();
  const { status, error, submit, reset: resetStatus } = useSubmit("consulta");
  const { register, handleSubmit, formState, reset } = useForm<C>({
    resolver: zodResolver(consultaSchema),
    defaultValues: { propiedadId: p.id, propiedadTitulo: p.titulo, asesor: asesor ?? undefined, mensaje: `Hola, me interesa esta propiedad y quisiera recibir más información.` },
  });
  if (status === "success")
    return (
      <SuccessScreen
        onReset={() => {
          reset();
          resetStatus();
        }}
        text={`${asesor ?? "Un asesor de Bellagamba"} te va a contactar a la brevedad por esta propiedad.`}
      />
    );
  const e = formState.errors;
  return (
    <form onSubmit={handleSubmit((d) => submit({ ...d, asesor: asesor ?? undefined }))} noValidate className="relative grid gap-4 sm:grid-cols-2">
      <Honeypot {...register("website")} />
      <Input label="Nombre y apellido" autoComplete="name" {...register("nombre")} error={e.nombre?.message} className="sm:col-span-2" />
      <Input label="Email" type="email" autoComplete="email" {...register("email")} error={e.email?.message} />
      <Input label="Teléfono" type="tel" autoComplete="tel" inputMode="tel" {...register("telefono")} error={e.telefono?.message} />
      <Textarea label="Mensaje" {...register("mensaje")} error={e.mensaje?.message} className="sm:col-span-2" />
      <div className="sm:col-span-2">
        <FormError error={error} />
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <SubmitButton status={status}>Enviar consulta</SubmitButton>
        <ButtonLink href={waLink(fichaWhatsAppMessage(p, asesor))} variant="whatsapp" size="lg" icon={<WhatsAppIcon size={18} />}>
          WhatsApp
        </ButtonLink>
      </div>
    </form>
  );
}

type V = z.infer<typeof visitaSchema>;
function VisitaForm({ p }: { p: P }) {
  const asesor = useAsesor();
  const { status, error, submit, reset: resetStatus } = useSubmit("visita");
  const days = useMemo(() => {
    const out: { value: string; dow: string; day: string; month: string; sat: boolean }[] = [];
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    while (out.length < 12) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() === 0) continue; // domingos cerrado
      out.push({
        value: d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" }),
        dow: d.toLocaleDateString("es-AR", { weekday: "short" }).replace(".", ""),
        day: String(d.getDate()),
        month: d.toLocaleDateString("es-AR", { month: "short" }).replace(".", ""),
        sat: d.getDay() === 6,
      });
    }
    return out;
  }, []);
  const { register, handleSubmit, formState, control, watch, reset, setValue } = useForm<V>({
    resolver: zodResolver(visitaSchema),
    defaultValues: { propiedadId: p.id, propiedadTitulo: p.titulo, dia: "" },
  });
  const dia = watch("dia");
  const isSat = days.find((d) => d.value === dia)?.sat;
  const franjas = isSat ? [FRANJAS[0]] : FRANJAS;
  const franja = watch("franja");
  useEffect(() => {
    if (isSat && franja && franja !== FRANJAS[0]) setValue("franja", undefined as unknown as V["franja"]);
  }, [isSat, franja, setValue]);

  if (status === "success")
    return (
      <SuccessScreen
        title="¡Visita solicitada!"
        text={`Te confirmamos la visita del ${dia} (${franja?.toLowerCase()}) por WhatsApp o teléfono.`}
        resetLabel="Agendar otra visita"
        onReset={() => {
          reset();
          resetStatus();
        }}
      />
    );
  const e = formState.errors;
  return (
    <form onSubmit={handleSubmit((d) => submit({ ...d, asesor: asesor ?? undefined }))} noValidate className="relative grid gap-6">
      <Honeypot {...register("website")} />
      <fieldset>
        <legend className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gris-text">Elegí el día</legend>
        <Controller
          control={control}
          name="dia"
          render={({ field }) => (
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="radiogroup" aria-label="Día de la visita">
              {days.map((d) => {
                const on = field.value === d.value;
                return (
                  <button
                    key={d.value}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-label={d.value}
                    onClick={() => field.onChange(d.value)}
                    className={clsx(
                      "flex h-20 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border transition-all duration-300 active:scale-95",
                      on ? "border-ink bg-ink text-white" : "border-ink/12 bg-white hover:border-ink"
                    )}
                  >
                    <span className={clsx("text-[11px] font-semibold uppercase", on ? "text-naranja" : "text-gris-text")}>{d.dow}</span>
                    <span className="text-xl font-semibold leading-tight">{d.day}</span>
                    <span className="text-[11px] opacity-70">{d.month}</span>
                  </button>
                );
              })}
            </div>
          )}
        />
        {e.dia && (
          <p role="alert" className="mt-1.5 text-[13px] font-medium text-red-700">
            {e.dia.message}
          </p>
        )}
      </fieldset>
      <Controller
        control={control}
        name="franja"
        render={({ field }) => <ChipGroup label={isSat ? "Franja horaria (sábados solo mañana)" : "Franja horaria"} options={franjas} value={field.value} onChange={(v) => field.onChange(v)} error={e.franja?.message} />}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Nombre y apellido" autoComplete="name" {...register("nombre")} error={e.nombre?.message} className="sm:col-span-2" />
        <Input label="Email" type="email" autoComplete="email" {...register("email")} error={e.email?.message} />
        <Input label="Teléfono" type="tel" autoComplete="tel" inputMode="tel" {...register("telefono")} error={e.telefono?.message} />
        <Textarea label="Comentarios (opcional)" rows={3} {...register("mensaje")} className="sm:col-span-2" />
      </div>
      <FormError error={error} />
      <div>
        <SubmitButton status={status}>Solicitar visita</SubmitButton>
      </div>
    </form>
  );
}
