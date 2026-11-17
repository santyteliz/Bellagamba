"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Lenis + sincronización con GSAP ScrollTrigger. Se desactiva con prefers-reduced-motion y en touch. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;
    let destroyed = false;
    let cleanup = () => {};
    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")]);
      if (destroyed) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
      (window as unknown as { __lenis?: typeof lenis }).__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        delete (window as unknown as { __lenis?: unknown }).__lenis;
      };
    })();
    return () => {
      destroyed = true;
      cleanup();
    };
  }, []);

  // Scroll al tope en cada cambio de ruta (Lenis no lo hace solo)
  useEffect(() => {
    const l = (window as unknown as { __lenis?: { scrollTo: (y: number, o: object) => void } }).__lenis;
    if (!window.location.hash) l?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
