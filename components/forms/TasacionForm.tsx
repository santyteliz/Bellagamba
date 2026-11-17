"use client";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { AMBIENTES_OPC, AMENITIES_TASACION, ANTIGUEDADES, tasacionPaso1, tasacionPaso2, tasacionSchema } from "@/lib/forms/schemas";
import { Input, Select, Textarea, ChipGroup, Honeypot, SubmitButton, FormError, SuccessScreen, useSubmit } from "./fields";
import { Stepper } from "./Stepper";
import { Icon } from "@/components/ui/Icon";

type D = z.infer<typeof tasacionSchema>;
const TIPOS = ["Casa", "Departamento", "PH", "Terreno", "Local", "Oficina", "Otro"] as const;

/** Tasación en 2 pasos: 1) Tus datos 2) La propiedad. Fotos opcionales (se adjunta el nombre/cantidad; upload real pendiente de storage). */
export function TasacionForm({ dark }: { dark?: boolean }) {
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const { status, error, submit, reset: resetStatus } = useSubmit("tasacion");
  const { register, handleSubmit, formState, control, trigger, reset, getValues } = useForm<D>({
    resolver: zodResolver(step === 0 ? tasacionPaso1 : tasacionSchema) as never,
    defaultValues: { amenities: [] },
    mode: "onTouched",
  });
  const e = formState.errors;

  const next = async () => {
    const ok = await trigger(Object.keys(tasacionPaso1.shape) as (keyof D)[]);
    if (ok) setStep(1);
  };

  if (status === "success")
    return (
      <SuccessScreen
        dark={dark}
        title="¡Recibimos tu solicitud de tasación!"
        text={`Gracias ${getValues("nombre")?.split(" ")[0] ?? ""}. Un especialista en Zona Norte te contacta en 24/48 hs hábiles con el análisis comparativo de mercado.`}
        onReset={() => {
          reset();
          setFiles([]);
          setStep(0);
          resetStatus();
        }}
      />
    );

  return (
    <form
      noValidate
      onSubmit={handleSubmit((d) => submit({ ...d, fotos: files.map((f) => f.name) }))}
      onKeyDown={(ev) => {
        if (ev.key === "Enter" && step === 0 && (ev.target as HTMLElement).tagName === "INPUT") {
          ev.preventDefault();
          next();
        }
      }}
      className="relative"
    >
      <Stepper steps={["Tus datos", "La propiedad"]} current={step} dark={dark} />
      <Honeypot {...register("website")} />
      <AnimatePresence mode="wait" initial={false}>
        {step === 0 ? (
          <motion.div key="s0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }} className="grid gap-4 sm:grid-cols-2">
            <Input label="Nombre y apellido" autoComplete="name" {...register("nombre")} error={e.nombre?.message} className="sm:col-span-2" />
            <Input label="Email" type="email" autoComplete="email" {...register("email")} error={e.email?.message} />
            <Input label="Teléfono" type="tel" inputMode="tel" autoComplete="tel" {...register("telefono")} error={e.telefono?.message} />
            <div className="mt-2 sm:col-span-2">
              <button type="button" onClick={next} className="group inline-flex h-14 items-center gap-3 rounded-full bg-naranja px-8 text-[15px] font-semibold text-ink transition-colors hover:bg-ink hover:text-white">
                Continuar <Icon name="arrow" size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.35 }} className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller control={control} name="operacion" render={({ field }) => <ChipGroup dark={dark} label="Operación" options={["Venta", "Alquiler"]} value={field.value} onChange={field.onChange} error={e.operacion?.message} />} />
              <Select label="Tipo de propiedad" options={TIPOS} {...register("tipo")} error={e.tipo?.message} />
            </div>
            <Input label="Ubicación (calle, altura y barrio)" autoComplete="street-address" {...register("ubicacion")} error={e.ubicacion?.message} />
            <Controller control={control} name="ambientes" render={({ field }) => <ChipGroup dark={dark} label="Ambientes" options={AMBIENTES_OPC} value={field.value} onChange={field.onChange} error={e.ambientes?.message} />} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Sup. cubierta (m²)" inputMode="numeric" {...register("supCubierta")} error={e.supCubierta?.message} />
              <Input label="Sup. total (m²)" inputMode="numeric" {...register("supTotal")} error={e.supTotal?.message} />
            </div>
            <Controller control={control} name="antiguedad" render={({ field }) => <ChipGroup dark={dark} label="Antigüedad" options={ANTIGUEDADES} value={field.value} onChange={field.onChange} error={e.antiguedad?.message} />} />
            <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
              <Controller control={control} name="garage" render={({ field }) => <ChipGroup dark={dark} label="Garage" options={["Sí", "No"]} value={field.value} onChange={field.onChange} error={e.garage?.message} />} />
              <Controller control={control} name="amenities" render={({ field }) => <ChipGroup dark={dark} multiple label="Amenities" options={AMENITIES_TASACION} value={field.value} onChange={field.onChange} />} />
            </div>
            <div>
              <p className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] ${dark ? "text-white/70" : "text-gris-text"}`}>Fotos (opcional)</p>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className={`flex w-full items-center gap-4 rounded-2xl border border-dashed p-5 text-left transition-colors ${dark ? "border-white/25 hover:border-white" : "border-ink/20 bg-white hover:border-ink"}`}
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-naranja text-ink">
                  <Icon name="upload" size={18} />
                </span>
                <span className="text-sm">
                  <strong className="block font-semibold">{files.length ? `${files.length} foto(s) seleccionada(s)` : "Subí fotos de tu propiedad"}</strong>
                  <span className={dark ? "text-white/60" : "text-gris-text"}>{files.length ? files.map((f) => f.name).join(", ").slice(0, 80) : "JPG o PNG, hasta 10 archivos"}</span>
                </span>
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple className="sr-only" tabIndex={-1} aria-label="Fotos de la propiedad" onChange={(ev) => setFiles(Array.from(ev.target.files || []).slice(0, 10))} />
            </div>
            <Textarea label="Comentarios (opcional)" rows={3} {...register("comentarios")} />
            <FormError error={error} />
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => setStep(0)} className={`inline-flex h-14 items-center gap-2 rounded-full border px-6 text-sm font-semibold ${dark ? "border-white/25 text-white hover:bg-white hover:text-ink" : "border-ink/15 hover:border-ink"}`}>
                <Icon name="arrow-left" size={16} /> Volver
              </button>
              <SubmitButton status={status}>Solicitar tasación</SubmitButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
