"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import clsx from "clsx";

const MapView = dynamic(() => import("./MapView"), { ssr: false, loading: () => <div className="skeleton absolute inset-0" /> });

/** Monta MapLibre recién cuando el contenedor se acerca al viewport (no afecta LCP). */
export function LazyMap({ className, ...props }: ComponentProps<typeof MapView> & { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setVisible(true), io.disconnect()), { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={clsx("relative overflow-hidden bg-arena", className)}>
      {visible ? <MapView {...props} className="absolute inset-0" /> : <div className="skeleton absolute inset-0" />}
    </div>
  );
}
