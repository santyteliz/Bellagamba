"use client";
import Link from "next/link";
import clsx from "clsx";
import { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";
import type { Filters } from "@/lib/properties/filters";
import type { Operacion } from "@/lib/properties/types";
import { FEATURE_LABELS } from "@/lib/properties/normalize";
import { Icon } from "@/components/ui/Icon";

export interface FacetData {
  tipos: Map<string, number>;
  barrios: Map<string, number>;
  features: Map<string, number>;
  allTipos: string[];
  allBarrios: string[];
  allFeatures: string[];
  priceBounds: [number, number];
}

export function FiltersPanel({
  f,
  set,
  facets,
  locked,
}: {
  f: Filters;
  set: (patch: Partial<Filters>) => void;
  facets: FacetData;
  locked: Operacion | null;
}) {
  const toggle = (key: "tipos" | "barrios" | "features", v: string) => set({ [key]: f[key].includes(v) ? f[key].filter((x) => x !== v) : [...f[key], v] } as Partial<Filters>);

  return (
    <div className="space-y-9">
      <Group title="Operación">
        <div className="flex flex-wrap gap-2">
          {(["venta", "alquiler", "temporario"] as Operacion[]).map((op) =>
            locked ? (
              <Link
                key={op}
                href={`/inmobiliaria/${op}`}
                aria-current={locked === op ? "page" : undefined}
                className={clsx("inline-flex h-10 items-center rounded-full border px-4 text-sm font-medium capitalize transition-colors", locked === op ? "border-ink bg-ink text-white" : "border-ink/15 bg-white hover:border-ink")}
              >
                {op}
              </Link>
            ) : (
              <Pill key={op} on={f.operacion === op} onClick={() => set({ operacion: f.operacion === op ? null : op })}>
                <span className="capitalize">{op}</span>
              </Pill>
            )
          )}
        </div>
      </Group>

      <Group title="Tipo de propiedad">
        {facets.allTipos.map((t) => (
          <Check key={t} label={t} count={facets.tipos.get(t) ?? 0} checked={f.tipos.includes(t)} onChange={() => toggle("tipos", t)} />
        ))}
      </Group>

      <Group title="Barrio">
        {facets.allBarrios.map((b) => (
          <Check key={b} label={b} count={facets.barrios.get(b) ?? 0} checked={f.barrios.includes(b)} onChange={() => toggle("barrios", b)} />
        ))}
      </Group>

      <Group title="Precio (USD)">
        <PriceRange bounds={facets.priceBounds} min={f.precioMin} max={f.precioMax} onCommit={(a, b) => set({ precioMin: a, precioMax: b })} />
      </Group>

      <Group title="Dormitorios">
        <MinPills value={f.dormitorios} options={[1, 2, 3, 4]} onChange={(v) => set({ dormitorios: v })} />
      </Group>
      <Group title="Ambientes">
        <MinPills value={f.ambientes} options={[1, 2, 3, 4, 5]} onChange={(v) => set({ ambientes: v })} />
      </Group>
      <Group title="Baños">
        <MinPills value={f.banos} options={[1, 2, 3]} onChange={(v) => set({ banos: v })} />
      </Group>

      <Group title="Superficie (m²)">
        <M2Inputs min={f.m2Min} max={f.m2Max} onCommit={(a, b) => set({ m2Min: a, m2Max: b })} />
      </Group>

      <Group title="Características">
        {facets.allFeatures.map((k) => (
          <Check key={k} label={FEATURE_LABELS[k] ?? k} count={facets.features.get(k) ?? 0} checked={f.features.includes(k)} onChange={() => toggle("features", k)} />
        ))}
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  const id = useId();
  return (
    <fieldset aria-labelledby={id}>
      <legend id={id} className="eyebrow mb-4 text-gris-text">
        {title}
      </legend>
      <div className="space-y-1">{children}</div>
    </fieldset>
  );
}

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={clsx("inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-4 text-sm font-medium transition-all duration-300 active:scale-95", on ? "border-ink bg-ink text-white" : "border-ink/15 bg-white hover:border-ink")}
    >
      {children}
    </button>
  );
}

function MinPills({ value, options, onChange }: { value: number | null; options: number[]; onChange: (v: number | null) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Pill on={!value} onClick={() => onChange(null)}>
        Todos
      </Pill>
      {options.map((o) => (
        <Pill key={o} on={value === o} onClick={() => onChange(value === o ? null : o)}>
          {o}+
        </Pill>
      ))}
    </div>
  );
}

function Check({ label, count, checked, onChange }: { label: string; count: number; checked: boolean; onChange: () => void }) {
  const disabled = count === 0 && !checked;
  return (
    <label className={clsx("group flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-ink/[0.04]", disabled && "cursor-default opacity-40")}>
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} className="peer sr-only" />
      <span
        className={clsx(
          "grid size-5 shrink-0 place-items-center rounded-md border transition-all duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-naranja",
          checked ? "border-ink bg-ink text-white" : "border-ink/25 bg-white group-hover:border-ink"
        )}
        aria-hidden="true"
      >
        <motion.svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <motion.path d="m5 12.5 4.5 4.5L19 7.5" initial={false} animate={{ pathLength: checked ? 1 : 0 }} transition={{ duration: 0.25 }} />
        </motion.svg>
      </span>
      <span className="flex-1 text-[15px]">{label}</span>
      <span className="text-[13px] tabular-nums text-gris-text">{count}</span>
    </label>
  );
}

const fmt = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toLocaleString("es-AR", { maximumFractionDigits: 2 })} M` : `${Math.round(n / 1000).toLocaleString("es-AR")} mil`);

/** Slider de rango doble (precio) */
export function PriceRange({ bounds, min, max, onCommit }: { bounds: [number, number]; min: number | null; max: number | null; onCommit: (a: number | null, b: number | null) => void }) {
  const [lo, hi] = bounds;
  const step = 10000;
  const [a, setA] = useState(min ?? lo);
  const [b, setB] = useState(max ?? hi);
  useEffect(() => {
    setA(min ?? lo);
    setB(max ?? hi);
  }, [min, max, lo, hi]);
  useEffect(() => {
    const t = setTimeout(() => {
      const na = a <= lo ? null : a;
      const nb = b >= hi ? null : b;
      if (na !== min || nb !== max) onCommit(na, nb);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b]);
  const pa = ((a - lo) / (hi - lo)) * 100;
  const pb = ((b - lo) / (hi - lo)) * 100;
  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-sm font-semibold tabular-nums">
        <span>USD {fmt(a)}</span>
        <span>{b >= hi ? `USD ${fmt(hi)}+` : `USD ${fmt(b)}`}</span>
      </div>
      <div className="relative h-6">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-ink/10" />
        <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-naranja" style={{ left: `${pa}%`, right: `${100 - pb}%` }} />
        <input
          type="range"
          aria-label="Precio mínimo"
          min={lo}
          max={hi}
          step={step}
          value={a}
          onChange={(e) => setA(Math.min(Number(e.target.value), b - step))}
          className="range-thumb absolute inset-0 h-6 w-full"
        />
        <input
          type="range"
          aria-label="Precio máximo"
          min={lo}
          max={hi}
          step={step}
          value={b}
          onChange={(e) => setB(Math.max(Number(e.target.value), a + step))}
          className="range-thumb absolute inset-0 h-6 w-full"
        />
      </div>
    </div>
  );
}

function M2Inputs({ min, max, onCommit }: { min: number | null; max: number | null; onCommit: (a: number | null, b: number | null) => void }) {
  const [a, setA] = useState(min ? String(min) : "");
  const [b, setB] = useState(max ? String(max) : "");
  useEffect(() => {
    setA(min ? String(min) : "");
    setB(max ? String(max) : "");
  }, [min, max]);
  const commit = () => onCommit(a ? Number(a) : null, b ? Number(b) : null);
  const cls = "h-11 w-full rounded-xl border border-ink/15 bg-white px-3 text-sm outline-none focus:border-ink";
  return (
    <div className="flex items-center gap-2">
      <label className="flex-1">
        <span className="sr-only">m² mínimos</span>
        <input inputMode="numeric" placeholder="Mín." value={a} onChange={(e) => setA(e.target.value.replace(/\D/g, ""))} onBlur={commit} onKeyDown={(e) => e.key === "Enter" && commit()} className={cls} />
      </label>
      <Icon name="minus" size={14} className="text-gris" />
      <label className="flex-1">
        <span className="sr-only">m² máximos</span>
        <input inputMode="numeric" placeholder="Máx." value={b} onChange={(e) => setB(e.target.value.replace(/\D/g, ""))} onBlur={commit} onKeyDown={(e) => e.key === "Enter" && commit()} className={cls} />
      </label>
    </div>
  );
}
