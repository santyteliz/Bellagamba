import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";
import { RevealLines, Reveal } from "./Reveal";

/** Encabezado de páginas internas. `image` → versión oscura a sangre. */
export function PageHero({
  eyebrow,
  lines,
  intro,
  image,
  crumbs,
  children,
  dark,
}: {
  eyebrow: string;
  lines: ReactNode[];
  intro?: ReactNode;
  image?: { src: string; alt: string; blur?: string };
  crumbs?: { label: string; href?: string }[];
  children?: ReactNode;
  dark?: boolean;
}) {
  const onImage = !!image || dark;
  return (
    <section className={clsx("relative isolate overflow-hidden", onImage ? "on-dark bg-ink text-white" : "", image ? "flex min-h-[78svh] items-end" : "")}>
      {image && (
        <>
          <Image src={image.src} alt={image.alt} fill priority sizes="100vw" placeholder={image.blur ? "blur" : "empty"} blurDataURL={image.blur} className="-z-10 object-cover" style={{ animation: "kenburns 14s ease-out both" }} />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(20_20_20/0.5)_0%,rgb(20_20_20/0.2)_40%,rgb(20_20_20/0.85)_100%)]" />
        </>
      )}
      <div className={clsx("container-x w-full", image ? "pb-16 pt-40 lg:pb-24" : "pb-14 pt-36 lg:pb-20 lg:pt-44")}>
        {crumbs && (
          <nav aria-label="Migas de pan" className={clsx("mb-8 text-[13px]", onImage ? "text-white/70" : "text-gris-text")}>
            <ol className="flex flex-wrap gap-1.5">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex gap-1.5">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {c.href ? (
                    <Link href={c.href} className={onImage ? "hover:text-white" : "hover:text-ink"}>
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className={onImage ? "text-white" : "text-ink"}>
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <p className={clsx("eyebrow mb-6 flex items-center gap-3", onImage ? "text-white/85" : "text-naranja-text")}>
          <span className="h-px w-10 bg-naranja" /> {eyebrow}
        </p>
        <RevealLines as="h1" className="max-w-5xl text-h1 font-light" lines={lines} />
        {intro && (
          <Reveal kind="fade" delay={250} className={clsx("mt-8 max-w-2xl text-lg leading-relaxed", onImage ? "text-white/80" : "text-gris-text")}>
            {intro}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
