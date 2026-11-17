"use client";
import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { formatNumber } from "@/lib/format";

/** Calculadora simple de crédito hipotecario (sistema francés). Valores orientativos, editables. */
export function MortgageCalculator({ precio, moneda }: { precio: number; moneda: string }) {
  const [pct, setPct] = useState(70); // % financiado
  const [plazo, setPlazo] = useState(20); // años
  const [tasa, setTasa] = useState(5.5); // TNA % [referencia editable]
  const id = useId();
  const monto = Math.round((precio * pct) / 100);
  const n = plazo * 12;
  const i = tasa / 100 / 12;
  const cuota = i === 0 ? monto / n : (monto * i) / (1 - Math.pow(1 + i, -n));
  const anticipo = precio - monto;

  return (
    <section aria-labelledby={`${id}-t`} className="rounded-[var(--radius-card)] bg-ink p-6 text-white sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-naranja text-ink">
          <Icon name="calculator" size={18} />
        </span>
        <div>
          <h2 id={`${id}-t`} className="text-xl font-medium">
            Calculadora de crédito
          </h2>
          <p className="text-[13px] text-white/70">Propiedad apta crédito · simulación orientativa</p>
        </div>
      </div>
      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div className="grid gap-6">
          <Range id={`${id}-pct`} label="Monto a financiar" value={pct} min={10} max={80} step={5} onChange={setPct} display={`${pct}% · ${moneda} ${formatNumber(monto)}`} />
          <Range id={`${id}-plazo`} label="Plazo" value={plazo} min={5} max={30} step={1} onChange={setPlazo} display={`${plazo} años`} />
          <Range id={`${id}-tasa`} label="Tasa nominal anual" value={tasa} min={2} max={15} step={0.25} onChange={setTasa} display={`${tasa.toLocaleString("es-AR")}%`} />
        </div>
        <div className="rounded-2xl bg-white/[0.06] p-6 md:min-w-64">
          <p className="eyebrow text-white/70">Cuota mensual estimada</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight tabular-nums text-naranja">
            {moneda} {formatNumber(Math.round(cuota))}
          </p>
          <p className="mt-3 text-[13px] text-white/70">
            Anticipo: {moneda} {formatNumber(anticipo)}
          </p>
        </div>
      </div>
      <p className="mt-6 text-[12px] leading-relaxed text-white/60">
        Simulación con sistema francés, no incluye gastos, seguros ni impuestos. Las condiciones reales dependen de cada banco. Consultanos y te acompañamos en el proceso.
      </p>
    </section>
  );
}

function Range({ id, label, value, min, max, step, onChange, display }: { id: string; label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void; display: string }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm text-white/80">
          {label}
        </label>
        <output htmlFor={id} className="text-sm font-semibold tabular-nums">
          {display}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-thumb h-1.5 w-full cursor-pointer rounded-full [pointer-events:auto]"
        style={{ background: `linear-gradient(90deg, #ef7208 ${pct}%, rgb(255 255 255 / 0.15) ${pct}%)` }}
      />
    </div>
  );
}
