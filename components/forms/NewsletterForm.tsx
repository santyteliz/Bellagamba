"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { newsletterSchema } from "@/lib/forms/schemas";
import { Icon } from "@/components/ui/Icon";
import { Honeypot, useSubmit } from "./fields";

type D = z.infer<typeof newsletterSchema>;

export function NewsletterForm() {
  const { status, error, submit, reset: resetStatus } = useSubmit("newsletter");
  const { register, handleSubmit, formState, reset } = useForm<D>({ resolver: zodResolver(newsletterSchema) });
  return (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <motion.div key="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 text-white/90" role="status">
          <span className="grid size-9 place-items-center rounded-full bg-naranja text-ink">
            <Icon name="check" size={16} strokeWidth={2.2} />
          </span>
          <span>¡Listo! Te sumamos al newsletter.</span>
          <button
            type="button"
            className="ml-auto text-sm text-white/60 underline underline-offset-4 hover:text-white"
            onClick={() => {
              reset();
              resetStatus();
            }}
          >
            Otro email
          </button>
        </motion.div>
      ) : (
        <motion.form key="f" exit={{ opacity: 0 }} onSubmit={handleSubmit((d) => submit(d))} noValidate className="relative">
          <Honeypot {...register("website")} />
          <label htmlFor="nl-email" className="sr-only">
            Tu email
          </label>
          <div className="flex h-14 items-center rounded-full border border-white/20 pl-5 pr-1.5 transition-colors focus-within:border-naranja">
            <input
              id="nl-email"
              type="email"
              autoComplete="email"
              placeholder="Tu email"
              {...register("email")}
              className="min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-white/50"
            />
            <button type="submit" disabled={status === "loading"} aria-label="Suscribirme" className="grid size-11 shrink-0 place-items-center rounded-full bg-naranja text-ink transition-colors hover:bg-white">
              {status === "loading" ? <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : <Icon name="arrow" size={18} />}
            </button>
          </div>
          {(formState.errors.email || error) && (
            <p role="alert" className="mt-2 px-2 text-[13px] text-red-300">
              {formState.errors.email?.message || error}
            </p>
          )}
        </motion.form>
      )}
    </AnimatePresence>
  );
}
