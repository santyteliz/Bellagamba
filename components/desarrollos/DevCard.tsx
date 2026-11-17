import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import type { Desarrollo } from "@/lib/desarrollos";
import { ETAPAS } from "@/lib/desarrollos";
import { ShulbiusMark } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";

export function DevCard({ d, href, dark }: { d: Desarrollo; href?: string; dark?: boolean }) {
  const etapa = ETAPAS.find((e) => e.value === d.etapa)?.label;
  const inner = (
    <>
      <div className={clsx("relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)]", dark ? "bg-carbon" : "bg-ink")}>
        {d.foto ? (
          <Image src={d.foto} alt={`${d.marca} ${d.nombre}`} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-white">
            <div className="flex flex-col items-center gap-6">
              <ShulbiusMark className="h-14 w-auto text-naranja/80" />
              <p className="text-[13px] uppercase tracking-shulbius text-white/80">{d.nombre}</p>
              <p className="rounded-full border border-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/60">Renders [CONFIRMAR]</p>
            </div>
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ink">{etapa ?? "Etapa [CONFIRMAR]"}</span>
          {d.marca === "Shulbius" && <span className="rounded-full bg-ink/80 px-3 py-1.5 text-[10px] uppercase tracking-shulbius text-white backdrop-blur">Shulbius</span>}
        </div>
      </div>
      <div className="pt-5">
        <p className={clsx("text-[12px] uppercase tracking-[0.3em]", dark ? "text-white/60" : "text-gris-text")}>{d.marca}</p>
        <h3 className={clsx("mt-2 text-2xl font-light tracking-tight", dark && "text-white")}>{d.nombre}</h3>
        <p className={clsx("mt-1 flex items-center gap-1.5 text-sm", dark ? "text-white/70" : "text-gris-text")}>
          <Icon name="pin" size={15} /> {d.direccion ?? "Dirección [CONFIRMAR]"}
          {d.barrio ? ` · ${d.barrio}` : ""}
        </p>
        {d.etapaNota && <p className={clsx("mt-2 text-sm font-semibold", dark ? "text-naranja" : "text-naranja-text")}>{d.etapaNota}</p>}
      </div>
    </>
  );
  if (!href) return <article className="group">{inner}</article>;
  return (
    <article className="group">
      <Link href={href} data-cursor="Ver" className="block">
        {inner}
      </Link>
    </article>
  );
}
