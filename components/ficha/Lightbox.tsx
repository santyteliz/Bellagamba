"use client";
import Image from "next/image";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { Icon } from "@/components/ui/Icon";

/** Lightbox fullscreen: swipe, zoom (doble click / botón / pinch nativo), teclado, contador y tira de miniaturas. */
export function Lightbox({
  fotos,
  blur,
  start,
  title,
  onClose,
}: {
  fotos: string[];
  blur: Record<string, string>;
  start: number;
  title: string;
  onClose: () => void;
}) {
  const [i, setI] = useState(start);
  const [dir, setDir] = useState(0);
  const [zoom, setZoom] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const thumbs = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (d: number) => {
      setZoom(false);
      setDir(d);
      setI((x) => (x + d + fotos.length) % fotos.length);
    },
    [fotos.length]
  );

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "z" || e.key === "+") setZoom((z) => !z);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenis?.start();
      prev?.focus();
    };
  }, [go, onClose]);

  useEffect(() => {
    const t = thumbs.current?.children[i] as HTMLElement | undefined;
    t?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [i]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (zoom) return;
    if (info.offset.x < -60 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
    else if (info.offset.y > 120) onClose();
  };

  const src = fotos[i];
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Galería de fotos: ${title}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[95] flex flex-col bg-ink text-white"
      data-lenis-prevent
    >
      <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
        <p className="text-sm tabular-nums text-white/80" aria-live="polite">
          <span className="font-semibold text-white">{String(i + 1).padStart(2, "0")}</span> / {String(fotos.length).padStart(2, "0")}
          <span className="ml-4 hidden text-white/60 sm:inline">{title}</span>
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setZoom((z) => !z)}
            aria-pressed={zoom}
            aria-label={zoom ? "Quitar zoom" : "Hacer zoom"}
            className="grid size-11 place-items-center rounded-full transition-colors hover:bg-white/10"
          >
            <Icon name={zoom ? "minus" : "zoom"} size={20} />
          </button>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Cerrar galería" className="grid size-11 place-items-center rounded-full transition-colors hover:bg-white/10">
            <Icon name="close" size={22} />
          </button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={src}
            custom={dir}
            initial={{ x: dir > 0 ? "100%" : dir < 0 ? "-100%" : 0, opacity: dir ? 1 : 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir > 0 ? "-30%" : "30%", opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            drag={zoom ? true : "x"}
            dragConstraints={zoom ? { left: -400, right: 400, top: -300, bottom: 300 } : { left: 0, right: 0 }}
            dragElastic={zoom ? 0.2 : 0.6}
            onDragEnd={onDragEnd}
            onDoubleClick={() => setZoom((z) => !z)}
            className={clsx("absolute inset-0 touch-none", zoom ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in")}
          >
            <motion.div className="relative h-full w-full" animate={{ scale: zoom ? 2 : 1 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
              <Image
                src={src}
                alt={`${title}, foto ${i + 1} de ${fotos.length}`}
                fill
                sizes="100vw"
                quality={85}
                placeholder={blur[src] ? "blur" : "empty"}
                blurDataURL={blur[src]}
                className="pointer-events-none select-none object-contain"
                draggable={false}
                priority
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
        {/* Precarga de vecinas */}
        <div className="hidden" aria-hidden="true">
          {[fotos[(i + 1) % fotos.length], fotos[(i - 1 + fotos.length) % fotos.length]].map((f) => (
            <Image key={f} src={f} alt="" width={1600} height={1200} sizes="100vw" quality={85} />
          ))}
        </div>
        <button type="button" onClick={() => go(-1)} aria-label="Foto anterior" className="absolute left-3 top-1/2 hidden size-14 -translate-y-1/2 place-items-center rounded-full bg-white/10 backdrop-blur transition-colors hover:bg-naranja hover:text-ink sm:grid">
          <Icon name="arrow-left" size={22} />
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Foto siguiente" className="absolute right-3 top-1/2 hidden size-14 -translate-y-1/2 place-items-center rounded-full bg-white/10 backdrop-blur transition-colors hover:bg-naranja hover:text-ink sm:grid">
          <Icon name="arrow" size={22} />
        </button>
      </div>

      <div ref={thumbs} className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto px-4 py-4 sm:justify-center sm:px-6">
        {fotos.map((f, k) => (
          <button
            key={f}
            type="button"
            onClick={() => {
              setDir(k > i ? 1 : -1);
              setZoom(false);
              setI(k);
            }}
            aria-label={`Ver foto ${k + 1}`}
            aria-current={k === i}
            className={clsx("relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition-all duration-300", k === i ? "opacity-100 ring-2 ring-naranja" : "opacity-45 hover:opacity-90")}
          >
            <Image src={f} alt="" fill sizes="96px" className="object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
