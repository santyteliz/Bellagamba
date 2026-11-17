"use client";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Logo, ShulbiusMark } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";

const DURATION = 4200;

/** Intro: selector Inmobiliaria / Desarrolladora (como su web actual) que pasa sola a /inmobiliaria. */
export function Intro() {
  const router = useRouter();
  const [hover, setHover] = useState<"inmo" | "dev" | null>(null);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const elapsed = useRef(0);

  useEffect(() => {
    router.prefetch("/inmobiliaria");
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = t - last;
      last = t;
      if (!paused) elapsed.current += dt;
      const p = Math.min(1, elapsed.current / DURATION);
      setProgress(p);
      if (p >= 1) {
        router.push("/inmobiliaria");
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, router]);

  return (
    <div className="on-dark relative flex min-h-[100svh] flex-col bg-ink text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-6 sm:px-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Logo variant="blanco" className="w-40" priority />
        </motion.div>
        <p className="hidden text-[12px] uppercase tracking-[0.3em] text-white/70 sm:block">Zona Norte · Desde 1990</p>
      </div>

      <div className="grid flex-1 md:grid-cols-2" onMouseLeave={() => (setHover(null), setPaused(false))}>
        <Panel
          href="/inmobiliaria"
          active={hover === "inmo"}
          dim={hover === "dev"}
          onEnter={() => (setHover("inmo"), setPaused(true))}
          img="/propiedades/14338622/02.jpg"
          eyebrow="Inmobiliaria"
          title={
            <>
              Encontrá ese inmueble <span className="text-naranja">que cumple con todo eso que querés.</span>
            </>
          }
          cta="Ver propiedades"
          delay={0.15}
        />
        <Panel
          href="/desarrolladora"
          active={hover === "dev"}
          dim={hover === "inmo"}
          onEnter={() => (setHover("dev"), setPaused(true))}
          img="/propiedades/13113629/01.jpg"
          eyebrow="Desarrolladora"
          title={
            <>
              Calidad <span className="text-naranja">que trasciende.</span>
            </>
          }
          cta="Conocé Shulbius"
          delay={0.3}
          shulbius
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-4 px-5 pb-5 sm:px-10 sm:pb-8">
        <div className="h-px flex-1 bg-white/15">
          <div className="h-px origin-left bg-naranja" style={{ transform: `scaleX(${progress})` }} />
        </div>
        <Link href="/inmobiliaria" className="pointer-events-auto text-[12px] font-semibold uppercase tracking-[0.2em] text-white/80 hover:text-white">
          {paused ? "Elegí una opción" : "Entrando a Inmobiliaria"} · Saltar
        </Link>
      </div>
    </div>
  );
}

function Panel({
  href,
  active,
  dim,
  onEnter,
  img,
  eyebrow,
  title,
  cta,
  delay,
  shulbius,
}: {
  href: string;
  active: boolean;
  dim: boolean;
  onEnter: () => void;
  img: string;
  eyebrow: string;
  title: React.ReactNode;
  cta: string;
  delay: number;
  shulbius?: boolean;
}) {
  return (
    <Link href={href} onMouseEnter={onEnter} onFocus={onEnter} className="group relative isolate flex min-h-[50svh] items-end overflow-hidden p-6 pb-20 sm:p-10 sm:pb-24 md:min-h-0">
      <motion.div initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }} transition={{ duration: 1.2, delay, ease: [0.76, 0, 0.24, 1] }} className="absolute inset-0 -z-10">
        <Image src={img} alt="" fill priority sizes="(min-width: 768px) 50vw, 100vw" className={clsx("object-cover transition-transform duration-[1.6s] ease-[var(--ease-expo)]", active ? "scale-110" : "scale-100")} />
        <div className={clsx("absolute inset-0 transition-colors duration-700", dim ? "bg-ink/80" : active ? "bg-ink/30" : "bg-ink/55")} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: delay + 0.6, ease: [0.16, 1, 0.3, 1] }} className="max-w-lg">
        {shulbius ? <ShulbiusMark className="mb-6 h-10 w-auto text-naranja" /> : <span className="mb-6 block size-3 rounded-full bg-verde" />}
        <p className={clsx("text-[12px] font-semibold uppercase", shulbius ? "tracking-shulbius" : "tracking-[0.3em]")}>{eyebrow}</p>
        <p className="mt-4 text-[clamp(1.8rem,1.2rem+2.4vw,3.4rem)] font-light leading-[1.05] tracking-[-0.03em]">{title}</p>
        <span className="mt-8 inline-flex items-center gap-3 text-sm font-semibold">
          <span className="grid size-12 place-items-center rounded-full bg-naranja text-ink transition-transform duration-500 group-hover:rotate-[-45deg]">
            <Icon name="arrow" size={20} />
          </span>
          {cta}
        </span>
      </motion.div>
    </Link>
  );
}
