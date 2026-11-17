import Link from "next/link";
import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "./Icon";

type Variant = "primary" | "dark" | "light" | "outline" | "outline-light" | "ghost" | "whatsapp";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold whitespace-nowrap transition-[background,color,box-shadow,transform] duration-300 ease-[var(--ease-expo)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  // Texto oscuro sobre naranja: contraste 7:1 (AA), fiel al tono de marca
  primary: "bg-naranja text-ink hover:bg-ink hover:text-white",
  dark: "bg-ink text-white hover:bg-naranja hover:text-ink",
  light: "bg-white text-ink hover:bg-naranja",
  outline: "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-white",
  "outline-light": "border border-white/30 text-white hover:bg-white hover:text-ink",
  ghost: "text-ink hover:bg-ink/5",
  whatsapp: "bg-[#187a42] text-white hover:bg-[#11643a]",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[13px]",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-[15px]",
};

interface Common {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

function Inner({ children, arrow, icon }: Pick<Common, "children" | "arrow" | "icon">) {
  return (
    <>
      {icon}
      <span>{children}</span>
      {arrow && (
        <span className="relative -mr-1 inline-flex size-5 overflow-hidden">
          <Icon name="arrow" size={18} className="absolute inset-0 m-auto transition-transform duration-500 ease-[var(--ease-expo)] group-hover/btn:translate-x-6" />
          <Icon name="arrow" size={18} className="absolute inset-0 m-auto -translate-x-6 transition-transform duration-500 ease-[var(--ease-expo)] group-hover/btn:translate-x-0" />
        </span>
      )}
    </>
  );
}

export function Button({ variant = "primary", size = "md", arrow, icon, className, children, ...rest }: Common & ComponentProps<"button">) {
  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} {...rest}>
      <Inner arrow={arrow} icon={icon}>
        {children}
      </Inner>
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  arrow,
  icon,
  className,
  children,
  href,
  external,
  ...rest
}: Common & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "href">) {
  const cls = clsx(base, variants[variant], sizes[size], className);
  if (external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:"))
    return (
      <a href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        <Inner arrow={arrow} icon={icon}>
          {children}
        </Inner>
      </a>
    );
  return (
    <Link href={href} className={cls} {...rest}>
      <Inner arrow={arrow} icon={icon}>
        {children}
      </Inner>
    </Link>
  );
}
