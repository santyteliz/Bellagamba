"use client";
import { useEffect, useRef, useState } from "react";

/** Contador animado al entrar en viewport (formato es-AR). */
export function Counter({ to, prefix = "", suffix = "", duration = 1800, format = true }: { to: number; prefix?: string; suffix?: string; duration?: number; format?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setV(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const k = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - k, 4);
          setV(Math.round(to * eased));
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);
  return (
    <span ref={ref} className="tabular-nums">
      <span className="sr-only">{`${prefix}${to}${suffix}`}</span>
      <span aria-hidden="true">
        {prefix}
        {format ? v.toLocaleString("es-AR") : v}
        {suffix}
      </span>
    </span>
  );
}
