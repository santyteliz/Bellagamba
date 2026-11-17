"use client";
import clsx from "clsx";
import { compareStore, toast, toggleCompare, COMPARE_MAX } from "@/lib/store";
import { Icon } from "@/components/ui/Icon";

export function CompareButton({ id, className, compact }: { id: number; className?: string; compact?: boolean }) {
  const list = compareStore.use();
  const on = list.includes(id);
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const r = toggleCompare(id);
        if (r === "full") toast(`Podés comparar hasta ${COMPARE_MAX} propiedades`, { label: "Ir al comparador", href: "/inmobiliaria/comparar" });
        if (r === "added") toast(`Agregada al comparador (${list.length + 1}/${COMPARE_MAX})`, { label: "Comparar", href: "/inmobiliaria/comparar" });
      }}
      className={clsx(
        "inline-flex items-center gap-2 rounded-full text-sm font-semibold transition-colors",
        compact ? "h-9 px-3 text-[13px]" : "h-12 border px-5",
        on ? "border-ink bg-ink text-white" : compact ? "text-ink/75 hover:bg-ink/5 hover:text-ink" : "border-ink/15 hover:border-ink",
        className
      )}
    >
      <Icon name={on ? "check" : "compare"} size={16} />
      {on ? "En comparador" : "Comparar"}
    </button>
  );
}
