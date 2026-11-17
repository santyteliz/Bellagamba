"use client";
import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { track } from "@/lib/analytics";
import type { Operacion } from "@/lib/properties/types";

export interface Facet {
  name: string;
  count: number;
}

const OPS: { value: Operacion; label: string }[] = [
  { value: "venta", label: "Venta" },
  { value: "alquiler", label: "Alquiler" },
  { value: "temporario", label: "Temporario" },
];
const PRECIOS = [100000, 150000, 200000, 300000, 400000, 500000, 750000, 1000000, 1500000];
const AMB = ["1", "2", "3", "4", "5"];

interface State {
  op: Operacion;
  tipo: string;
  zona: string;
  amb: string;
  precio: string;
}

function useSearch() {
  const router = useRouter();
  const [s, setS] = useState<State>({ op: "venta", tipo: "", zona: "", amb: "", precio: "" });
  const go = () => {
    const q = new URLSearchParams();
    if (s.tipo) q.set("tipo", s.tipo);
    if (s.zona) q.set("barrio", s.zona);
    if (s.amb) q.set("ambientes", s.amb);
    if (s.precio) q.set("precio_max", s.precio);
    track("search", { operacion: s.op, tipo: s.tipo, zona: s.zona });
    router.push(`/inmobiliaria/${s.op}${q.toString() ? `?${q}` : ""}`);
  };
  return { s, setS, go };
}

function OpToggle({ value, onChange, dark }: { value: Operacion; onChange: (o: Operacion) => void; dark?: boolean }) {
  const id = useId();
  return (
    <div role="radiogroup" aria-label="Operación" className={clsx("inline-flex rounded-full p-1", dark ? "bg-white/15 backdrop-blur-md" : "bg-crema")}>
      {OPS.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={clsx(
            "relative h-10 rounded-full px-5 text-sm font-semibold transition-colors duration-300",
            value === o.value ? "text-ink" : dark ? "text-white/90 hover:text-white" : "text-ink/70 hover:text-ink"
          )}
        >
          {value === o.value && <motion.span layoutId={`op-${id}`} className="absolute inset-0 rounded-full bg-naranja" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
          <span className="relative">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

/** Autocompletar de zonas con contador (combobox accesible) */
function ZonaCombo({ zonas, value, onChange, className }: { zonas: Facet[]; value: string; onChange: (v: string) => void; className?: string }) {
  const [q, setQ] = useState(value);
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => setQ(value), [value]);
  const norm = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const list = useMemo(() => zonas.filter((z) => norm(z.name).includes(norm(q))).slice(0, 8), [q, zonas]);
  useEffect(() => {
    const close = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const pick = (z: string) => {
    onChange(z);
    setQ(z);
    setOpen(false);
  };
  return (
    <div ref={box} className={clsx("relative", className)}>
      <label htmlFor={`${id}-i`} className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-gris-text">
        Zona
      </label>
      <input
        id={`${id}-i`}
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-l`}
        aria-autocomplete="list"
        aria-activedescendant={open && list[hi] ? `${id}-o${hi}` : undefined}
        autoComplete="off"
        placeholder="Barrio o localidad"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
          setHi(0);
          if (!e.target.value) onChange("");
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") (e.preventDefault(), setOpen(true), setHi((h) => Math.min(h + 1, list.length - 1)));
          if (e.key === "ArrowUp") (e.preventDefault(), setHi((h) => Math.max(h - 1, 0)));
          if (e.key === "Enter" && open && list[hi]) (e.preventDefault(), pick(list[hi].name));
          if (e.key === "Escape") setOpen(false);
        }}
        className="mt-1 w-full truncate bg-transparent text-[15px] font-medium text-ink outline-none placeholder:font-normal placeholder:text-ink/50"
      />
      <AnimatePresence>
        {open && list.length > 0 && (
          <motion.ul
            id={`${id}-l`}
            role="listbox"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-full z-30 mt-4 max-h-72 w-72 overflow-auto rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-ink/5"
            data-lenis-prevent
          >
            {list.map((z, i) => (
              <li
                key={z.name}
                id={`${id}-o${i}`}
                role="option"
                aria-selected={i === hi}
                onMouseEnter={() => setHi(i)}
                onMouseDown={(e) => (e.preventDefault(), pick(z.name))}
                className={clsx("flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm", i === hi && "bg-crema")}
              >
                <span className="flex items-center gap-2">
                  <Icon name="pin" size={16} className="text-gris" /> {z.name}
                </span>
                <span className="rounded-full bg-ink/5 px-2 py-0.5 text-xs font-semibold tabular-nums text-gris-text">{z.count}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={clsx("block", className)}>
      <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-gris-text">{label}</span>
      {children}
    </label>
  );
}

const selectCls = "mt-1 w-full appearance-none truncate bg-transparent pr-5 text-[15px] font-medium text-ink outline-none";

function Fields({ s, setS, zonas, tipos, stacked }: { s: State; setS: React.Dispatch<React.SetStateAction<State>>; zonas: Facet[]; tipos: Facet[]; stacked?: boolean }) {
  const wrap = stacked ? "rounded-2xl border border-ink/10 bg-white px-4 py-3" : "min-w-0 flex-1 px-5 py-3";
  return (
    <>
      <Field label="Tipo" className={wrap}>
        <span className="relative block">
          <select value={s.tipo} onChange={(e) => setS((x) => ({ ...x, tipo: e.target.value }))} className={selectCls}>
            <option value="">Todos</option>
            {tipos.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name} ({t.count})
              </option>
            ))}
          </select>
          <Icon name="chevron-down" size={16} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gris" />
        </span>
      </Field>
      {!stacked && <span className="my-3 w-px bg-ink/10" aria-hidden="true" />}
      <ZonaCombo zonas={zonas} value={s.zona} onChange={(z) => setS((x) => ({ ...x, zona: z }))} className={clsx(wrap, !stacked && "flex-[1.4]")} />
      {!stacked && <span className="my-3 w-px bg-ink/10" aria-hidden="true" />}
      <Field label="Ambientes" className={wrap}>
        <span className="relative block">
          <select value={s.amb} onChange={(e) => setS((x) => ({ ...x, amb: e.target.value }))} className={selectCls}>
            <option value="">Indistinto</option>
            {AMB.map((a) => (
              <option key={a} value={a}>
                {a === "5" ? "5 o más" : `${a} o más`}
              </option>
            ))}
          </select>
          <Icon name="chevron-down" size={16} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gris" />
        </span>
      </Field>
      {!stacked && <span className="my-3 w-px bg-ink/10" aria-hidden="true" />}
      <Field label="Precio máx." className={wrap}>
        <span className="relative block">
          <select value={s.precio} onChange={(e) => setS((x) => ({ ...x, precio: e.target.value }))} className={selectCls}>
            <option value="">Sin límite</option>
            {PRECIOS.map((p) => (
              <option key={p} value={p}>
                USD {p.toLocaleString("es-AR")}
              </option>
            ))}
          </select>
          <Icon name="chevron-down" size={16} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gris" />
        </span>
      </Field>
    </>
  );
}

export function SearchBox({ zonas, tipos }: { zonas: Facet[]; tipos: Facet[] }) {
  const { s, setS, go } = useSearch();
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    document.documentElement.style.overflow = sheet ? "hidden" : "";
    if (sheet) lenis?.stop();
    else lenis?.start();
  }, [sheet]);

  return (
    <div>
      {/* Desktop / tablet */}
      <div className="hidden md:block">
        <OpToggle value={s.op} onChange={(op) => setS((x) => ({ ...x, op }))} dark />
        <form
          role="search"
          aria-label="Buscar propiedades"
          onSubmit={(e) => (e.preventDefault(), go())}
          className="mt-3 flex items-stretch rounded-[1.75rem] bg-white p-2 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.5)]"
        >
          <Fields s={s} setS={setS} zonas={zonas} tipos={tipos} />
          <button type="submit" className="group inline-flex shrink-0 items-center gap-2.5 rounded-[1.35rem] bg-naranja px-7 text-[15px] font-semibold text-ink transition-colors hover:bg-ink hover:text-white">
            <Icon name="search" size={20} /> Buscar
          </button>
        </form>
        <Link href="/inmobiliaria/propiedades" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white">
          <Icon name="sliders" size={16} /> Búsqueda avanzada
        </Link>
      </div>

      {/* Mobile: disparador + bottom sheet */}
      <div className="md:hidden">
        <button type="button" onClick={() => setSheet(true)} className="flex h-16 w-full items-center gap-3 rounded-full bg-white pl-5 pr-2 text-left shadow-2xl">
          <Icon name="search" size={20} className="text-gris" />
          <span className="flex-1">
            <span className="block text-[15px] font-semibold">¿Qué estás buscando?</span>
            <span className="block text-[12px] text-gris-text">Tipo · Zona · Ambientes · Precio</span>
          </span>
          <span className="grid size-12 place-items-center rounded-full bg-naranja text-ink">
            <Icon name="sliders" size={18} />
          </span>
        </button>
        <AnimatePresence>
          {sheet && (
            <>
              <motion.div className="fixed inset-0 z-[60] bg-ink/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(false)} />
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Buscar propiedades"
                className="fixed inset-x-0 bottom-0 z-[61] max-h-[88dvh] overflow-y-auto rounded-t-[2rem] bg-crema px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 34 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.6 }}
                onDragEnd={(_, i) => i.offset.y > 120 && setSheet(false)}
                data-lenis-prevent
              >
                <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-ink/15" aria-hidden="true" />
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-xl font-medium">Buscá tu propiedad</p>
                  <button type="button" onClick={() => setSheet(false)} aria-label="Cerrar" className="grid size-10 place-items-center rounded-full bg-white">
                    <Icon name="close" size={18} />
                  </button>
                </div>
                <OpToggle value={s.op} onChange={(op) => setS((x) => ({ ...x, op }))} />
                <form onSubmit={(e) => (e.preventDefault(), setSheet(false), go())} className="mt-4 grid gap-2.5">
                  <Fields s={s} setS={setS} zonas={zonas} tipos={tipos} stacked />
                  <button type="submit" className="mt-3 inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-naranja text-[15px] font-semibold text-ink">
                    <Icon name="search" size={20} /> Buscar propiedades
                  </button>
                  <Link href="/inmobiliaria/propiedades" className="py-3 text-center text-sm font-semibold text-gris-text" onClick={() => setSheet(false)}>
                    Búsqueda avanzada
                  </Link>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
