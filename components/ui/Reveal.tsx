"use client";
import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Kind = "lines" | "fade" | "clip" | "stagger";

/** Observa el elemento y setea data-in cuando entra al viewport. La animación vive en CSS (globals.css). */
export function Reveal({
  as = "div",
  kind = "fade",
  delay = 0,
  className,
  children,
  once = true,
  style,
  threshold = 0.15,
  id,
}: {
  as?: keyof React.JSX.IntrinsicElements;
  kind?: Kind;
  delay?: number;
  className?: string;
  children: ReactNode;
  once?: boolean;
  style?: CSSProperties;
  threshold?: number;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.setAttribute("data-in", "");
            if (once) io.disconnect();
          } else if (!once) el.removeAttribute("data-in");
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, threshold]);

  return createElement(
    as,
    {
      ref,
      id,
      className,
      "data-reveal": kind === "lines" ? "lines" : kind,
      style: { ...style, "--d": `${delay}ms` } as CSSProperties,
    },
    children
  );
}

/** Titular con reveal por líneas enmascaradas. Cada item de `lines` es una línea. */
export function RevealLines({
  as = "h2",
  lines,
  className,
  delay = 0,
  id,
}: {
  as?: keyof React.JSX.IntrinsicElements;
  lines: ReactNode[];
  className?: string;
  delay?: number;
  id?: string;
}) {
  return (
    <Reveal as={as} kind="lines" className={className} delay={delay} id={id}>
      {lines.map((l, i) => (
        <span key={i} className="rl" style={{ "--i": i } as CSSProperties}>
          <span>{l}</span>
        </span>
      ))}
    </Reveal>
  );
}
