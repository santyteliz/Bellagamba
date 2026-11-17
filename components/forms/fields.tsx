"use client";
import clsx from "clsx";
import { forwardRef, useId, useState, type ComponentProps, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { track } from "@/lib/analytics";
import type { FormType } from "@/lib/forms/schemas";

export type Status = "idle" | "loading" | "success" | "error";

/** Envía al endpoint único y maneja estados. */
export function useSubmit(type: FormType) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  async function submit(data: Record<string, unknown>) {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, data, pagina: pathname }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos enviar el formulario.");
      setStatus("success");
      track("generate_lead", { form: type });
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
      setStatus("error");
      return false;
    }
  }
  return { status, error, submit, reset: () => (setStatus("idle"), setError(null)) };
}

const inputBase =
  "peer w-full rounded-2xl border bg-white px-4 pb-2.5 pt-6 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-transparent focus:border-ink focus:shadow-[0_0_0_4px_rgb(239_114_8/0.18)]";

type FieldProps = { label: string; error?: string; hint?: string; dark?: boolean };

/** Input con label flotante */
export const Input = forwardRef<HTMLInputElement, FieldProps & ComponentProps<"input">>(function Input({ label, error, hint, className, dark, ...rest }, ref) {
  const id = useId();
  return (
    <div className={className}>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          placeholder={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-e` : hint ? `${id}-h` : undefined}
          className={clsx(inputBase, error ? "border-red-600" : dark ? "border-white/15" : "border-ink/12")}
          {...rest}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-1.5 origin-left text-[11px] font-semibold uppercase tracking-[0.12em] text-gris-text transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-[0.12em]"
        >
          {label}
        </label>
      </div>
      <FieldMessage id={id} error={error} hint={hint} />
    </div>
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, FieldProps & ComponentProps<"textarea">>(function Textarea({ label, error, hint, className, ...rest }, ref) {
  const id = useId();
  return (
    <div className={className}>
      <div className="relative">
        <textarea
          ref={ref}
          id={id}
          rows={4}
          placeholder={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-e` : undefined}
          className={clsx(inputBase, "resize-none pt-7", error ? "border-red-600" : "border-ink/12")}
          {...rest}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gris-text transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-[0.12em]"
        >
          {label}
        </label>
      </div>
      <FieldMessage id={id} error={error} hint={hint} />
    </div>
  );
});

export const Select = forwardRef<HTMLSelectElement, FieldProps & ComponentProps<"select"> & { options: readonly string[]; placeholder?: string }>(function Select(
  { label, error, options, placeholder = "Elegí una opción", className, ...rest },
  ref
) {
  const id = useId();
  return (
    <div className={className}>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-e` : undefined}
          className={clsx(inputBase, "appearance-none pr-10", error ? "border-red-600" : "border-ink/12")}
          defaultValue=""
          {...rest}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <label htmlFor={id} className="pointer-events-none absolute left-4 top-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gris-text">
          {label}
        </label>
        <Icon name="chevron-down" size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gris-text" />
      </div>
      <FieldMessage id={id} error={error} />
    </div>
  );
});

export function FieldMessage({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  return (
    <AnimatePresence initial={false}>
      {error ? (
        <motion.p
          key="e"
          id={`${id}-e`}
          role="alert"
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-1.5 px-1 text-[13px] font-medium text-red-700"
        >
          {error}
        </motion.p>
      ) : hint ? (
        <p id={`${id}-h`} className="mt-1.5 px-1 text-[13px] text-gris-text">
          {hint}
        </p>
      ) : null}
    </AnimatePresence>
  );
}

/** Grupo de chips (radio o multi) accesible */
export function ChipGroup({
  label,
  options,
  value,
  onChange,
  multiple,
  error,
  className,
  dark,
}: {
  label: string;
  options: readonly string[];
  value: string | string[] | undefined;
  onChange: (v: string | string[]) => void;
  multiple?: boolean;
  error?: string;
  className?: string;
  dark?: boolean;
}) {
  const id = useId();
  const selected = (o: string) => (multiple ? ((value as string[]) || []).includes(o) : value === o);
  return (
    <fieldset className={className} aria-describedby={error ? `${id}-e` : undefined}>
      <legend className={clsx("mb-3 text-[11px] font-semibold uppercase tracking-[0.12em]", dark ? "text-white/70" : "text-gris-text")}>{label}</legend>
      <div className="flex flex-wrap gap-2" role={multiple ? "group" : "radiogroup"}>
        {options.map((o) => {
          const on = selected(o);
          return (
            <button
              key={o}
              type="button"
              role={multiple ? "checkbox" : "radio"}
              aria-checked={on}
              onClick={() => {
                if (multiple) {
                  const arr = ((value as string[]) || []).slice();
                  onChange(on ? arr.filter((x) => x !== o) : [...arr, o]);
                } else onChange(o);
              }}
              className={clsx(
                "inline-flex h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-all duration-300 active:scale-95",
                on ? "border-ink bg-ink text-white" : dark ? "border-white/20 text-white hover:border-white" : "border-ink/15 bg-white hover:border-ink"
              )}
            >
              <AnimatePresence initial={false}>
                {on && (
                  <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="overflow-hidden">
                    <Icon name="check" size={14} strokeWidth={2.2} className="text-naranja" />
                  </motion.span>
                )}
              </AnimatePresence>
              {o}
            </button>
          );
        })}
      </div>
      <FieldMessage id={id} error={error} />
    </fieldset>
  );
}

/** Campo trampa para bots: fuera de pantalla, sin tab, sin autocompletar */
export function Honeypot(props: ComponentProps<"input">) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        No completar
        <input type="text" tabIndex={-1} autoComplete="off" {...props} />
      </label>
    </div>
  );
}

export function SubmitButton({ status, children, className }: { status: Status; children: ReactNode; className?: string }) {
  return (
    <button
      type="submit"
      disabled={status === "loading"}
      className={clsx(
        "group/btn relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-naranja px-8 text-[15px] font-semibold text-ink transition-colors duration-300 hover:bg-ink hover:text-white disabled:opacity-70",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {status === "loading" ? (
          <motion.span key="l" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="inline-flex items-center gap-3">
            <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />
            Enviando…
          </motion.span>
        ) : (
          <motion.span key="i" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="inline-flex items-center gap-3">
            {children}
            <Icon name="arrow" size={18} className="transition-transform duration-500 group-hover/btn:translate-x-1" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export function FormError({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <p role="alert" className="flex items-start gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
      <Icon name="close" size={18} className="mt-0.5 shrink-0" /> {error}
    </p>
  );
}

/** Pantalla de confirmación con opción "Enviar otra consulta" */
export function SuccessScreen({
  title = "¡Gracias! Recibimos tu consulta.",
  text = "Un asesor de Bellagamba te va a contactar a la brevedad.",
  onReset,
  resetLabel = "Enviar otra consulta",
  children,
  dark,
}: {
  title?: string;
  text?: string;
  onReset?: () => void;
  resetLabel?: string;
  children?: ReactNode;
  dark?: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} role="status" className="py-6">
      <div className="relative mb-6 grid size-16 place-items-center rounded-full bg-naranja text-ink">
        <motion.svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <motion.path d="m5 12.5 4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.2 }} />
        </motion.svg>
        <span className="absolute -right-1 top-1 size-3 rounded-full bg-verde" />
      </div>
      <h3 className={clsx("text-h3 font-light", dark && "text-white")}>{title}</h3>
      <p className={clsx("mt-3 max-w-md", dark ? "text-white/70" : "text-gris-text")}>{text}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {children}
        {onReset && (
          <button type="button" onClick={onReset} className={clsx("inline-flex h-12 items-center gap-2 rounded-full border px-6 text-sm font-semibold transition-colors", dark ? "border-white/25 text-white hover:bg-white hover:text-ink" : "border-ink/15 hover:bg-ink hover:text-white")}>
            <Icon name="plus" size={16} /> {resetLabel}
          </button>
        )}
      </div>
    </motion.div>
  );
}
