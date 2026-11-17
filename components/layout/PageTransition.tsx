"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Cortina naranja entre páginas. Intercepta clicks en links internos (fase de captura),
 * cubre la pantalla, navega y descubre cuando cambia la ruta.
 * Cambios solo de querystring (filtros) o anchors no disparan cortina.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);
  const fallback = useRef<number | undefined>(undefined);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onClick = (e: MouseEvent) => {
      if (reduce || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.dataset.noTransition !== undefined) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // filtros / hash
      e.preventDefault();
      pending.current = url.pathname + url.search + url.hash;
      el.dataset.state = "cover";
      window.setTimeout(() => {
        if (pending.current) router.push(pending.current);
      }, 420);
      window.clearTimeout(fallback.current);
      fallback.current = window.setTimeout(() => (el.dataset.state = "reveal"), 5000);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.dataset.state !== "cover") return;
    pending.current = null;
    window.clearTimeout(fallback.current);
    requestAnimationFrame(() => {
      el.dataset.state = "reveal";
    });
  }, [pathname]);

  return (
    <div
      ref={ref}
      data-state="idle"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] translate-y-full bg-naranja data-[state=cover]:pointer-events-auto data-[state=cover]:translate-y-0 data-[state=cover]:transition-transform data-[state=cover]:duration-[420ms] data-[state=cover]:ease-[var(--ease-quart)] data-[state=reveal]:-translate-y-full data-[state=reveal]:transition-transform data-[state=reveal]:duration-[650ms] data-[state=reveal]:ease-[var(--ease-quart)]"
      onTransitionEnd={(e) => {
        const el = e.currentTarget;
        if (el.dataset.state === "reveal") {
          el.dataset.state = "idle";
        }
      }}
    >
      <div className="absolute inset-0 grid place-items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/marca/logo-bellagamba-negro.svg" alt="" width={153} height={20} className="w-40 opacity-90" />
      </div>
    </div>
  );
}
