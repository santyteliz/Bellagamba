import clsx from "clsx";
import type { ReactNode } from "react";

/** Marquee infinito (CSS). Contenido duplicado y oculto a lectores de pantalla en la copia. */
export function Marquee({ children, duration = 40, className, reverse }: { children: ReactNode; duration?: number; className?: string; reverse?: boolean }) {
  return (
    <div className={clsx("group flex overflow-hidden", className)}>
      <div
        className="animate-marquee flex shrink-0 items-center group-hover:[animation-play-state:paused]"
        style={{ "--marquee-duration": `${duration}s`, animationDirection: reverse ? "reverse" : undefined } as React.CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
