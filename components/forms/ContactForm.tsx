"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { ASUNTOS, contactoSchema } from "@/lib/forms/schemas";
import { Input, Textarea, Select, Honeypot, SubmitButton, FormError, SuccessScreen, useSubmit } from "./fields";

type D = z.infer<typeof contactoSchema>;

export function ContactForm({ defaultAsunto }: { defaultAsunto?: (typeof ASUNTOS)[number] }) {
  const { status, error, submit, reset: resetStatus } = useSubmit("contacto");
  const { register, handleSubmit, formState, reset } = useForm<D>({
    resolver: zodResolver(contactoSchema),
    defaultValues: { asunto: defaultAsunto },
  });
  if (status === "success")
    return (
      <SuccessScreen
        onReset={() => {
          reset();
          resetStatus();
        }}
      />
    );
  const e = formState.errors;
  return (
    <form onSubmit={handleSubmit((d) => submit(d))} noValidate className="relative grid gap-4 sm:grid-cols-2">
      <Honeypot {...register("website")} />
      <Input label="Nombre y apellido" autoComplete="name" {...register("nombre")} error={e.nombre?.message} />
      <Select label="Asunto" options={ASUNTOS} {...register("asunto")} error={e.asunto?.message} />
      <Input label="Email" type="email" autoComplete="email" {...register("email")} error={e.email?.message} />
      <Input label="Teléfono" type="tel" inputMode="tel" autoComplete="tel" {...register("telefono")} error={e.telefono?.message} />
      <Textarea label="¿En qué te podemos ayudar?" {...register("mensaje")} error={e.mensaje?.message} className="sm:col-span-2" />
      <div className="sm:col-span-2">
        <FormError error={error} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 sm:col-span-2">
        <p className="max-w-xs text-[12px] leading-relaxed text-gris-text">Usamos tus datos solo para responder tu consulta. Ver política de privacidad.</p>
        <SubmitButton status={status}>Enviar consulta</SubmitButton>
      </div>
    </form>
  );
}
