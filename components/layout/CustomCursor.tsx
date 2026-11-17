"use client";
import { useEffect, useRef, useState } from "react";

/** Cursor "Ver" sobre elementos con [data-cursor]. Solo desktop (pointer: fine) y sin reduced-motion. */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const ok = window.matchMedia("(pointer: fine) and (hover: hover)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(ok);
    if (!ok) return;
    let x = 0,
      y = 0,
      cx = 0,
      cy = 0,
      raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = (e.target as HTMLElement | null)?.closest?.("[data-cursor]") as HTMLElement | null;
      setLabel(t ? t.dataset.cursor || "Ver" : null);
    };
    const loop = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      if (ref.current) ref.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[80]">
      <div
        className="grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-naranja text-[13px] font-semibold text-ink transition-[transform,opacity] duration-300 ease-[var(--ease-expo)]"
        style={{ transform: `translate(-50%, -50%) scale(${label ? 1 : 0})`, opacity: label ? 1 : 0 }}
      >
        {label}
      </div>
    </div>
  );
}
