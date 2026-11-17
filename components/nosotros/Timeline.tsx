"use client";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export interface Milestone {
  year: string;
  title: string;
  text: string;
  pending?: boolean;
}

/** Timeline vertical: la línea naranja se llena con el scroll y cada hito se enciende al pasar. */
export function Timeline({ items }: { items: Milestone[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const [p, setP] = useState(0);
  const [active, setActive] = useState(-1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const prog = Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height));
      setP(prog);
      const lis = [...el.querySelectorAll<HTMLElement>("[data-m]")];
      let a = -1;
      lis.forEach((li, i) => li.getBoundingClientRect().top < vh * 0.6 && (a = i));
      setActive(a);
    };
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <ol ref={ref} className="relative ml-3 sm:ml-0">
      <span className="absolute bottom-0 left-0 top-0 w-px bg-ink/10 sm:left-[calc(9rem+1px)]" aria-hidden="true" />
      <span className="absolute left-0 top-0 w-px origin-top bg-naranja sm:left-[calc(9rem+1px)]" style={{ height: "100%", transform: `scaleY(${p})` }} aria-hidden="true" />
      {items.map((m, i) => (
        <li key={m.title} data-m className="relative grid gap-3 pb-20 pl-10 last:pb-0 sm:grid-cols-[9rem_1fr] sm:gap-12 sm:pl-0">
          <span
            className={clsx(
              "absolute left-0 top-2 size-3 -translate-x-1/2 rounded-full border-2 transition-all duration-500 sm:left-[calc(9rem+1px)]",
              i <= active ? "scale-125 border-naranja bg-naranja" : "border-ink/20 bg-crema"
            )}
            aria-hidden="true"
          />
          <p className={clsx("text-[2.5rem] font-light leading-none tracking-tight tabular-nums transition-colors duration-500 sm:text-right", i <= active ? "text-ink" : "text-ink/30", m.pending && "text-2xl")}>{m.year}</p>
          <div className={clsx("transition-all duration-700 ease-[var(--ease-expo)] sm:pl-12", i <= active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-50")}>
            <h3 className="text-h3 font-light">{m.title}</h3>
            <p className="mt-3 max-w-xl text-gris-text">{m.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
