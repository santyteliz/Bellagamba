"use client";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { favoritesStore, toast, toggleFavorite } from "@/lib/store";
import { track } from "@/lib/analytics";
import { Icon } from "@/components/ui/Icon";

export function FavoriteButton({ id, title, className, variant = "float" }: { id: number; title: string; className?: string; variant?: "float" | "inline" }) {
  const favs = favoritesStore.use();
  const on = favs.includes(id);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? `Quitar ${title} de favoritos` : `Guardar ${title} en favoritos`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = toggleFavorite(id);
        if (added) {
          track("add_to_wishlist", { item_id: id });
          toast("Guardada en favoritos", { label: "Ver favoritos", href: "/inmobiliaria/favoritos" });
        }
      }}
      className={clsx(
        "relative grid place-items-center rounded-full transition-[background,transform,color] duration-300 active:scale-90",
        variant === "float" ? "size-10 bg-white/90 text-ink backdrop-blur hover:bg-white" : "h-12 gap-2 border border-ink/15 px-5 text-sm font-semibold hover:border-ink",
        variant === "inline" && "inline-flex grid-flow-col",
        className
      )}
    >
      <span className="relative grid place-items-center">
        <motion.span animate={on ? { scale: [1, 1.35, 1] } : { scale: 1 }} transition={{ duration: 0.45 }}>
          <Icon name="heart" size={18} className={clsx("transition-colors", on ? "fill-naranja text-naranja" : "")} />
        </motion.span>
        <AnimatePresence>
          {on && (
            <motion.span key="burst" className="pointer-events-none absolute inset-0" initial={{ opacity: 1 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/2 size-1 rounded-full bg-naranja"
                  initial={{ x: 0, y: 0 }}
                  animate={{ x: Math.cos((i / 6) * Math.PI * 2) * 16, y: Math.sin((i / 6) * Math.PI * 2) * 16 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              ))}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {variant === "inline" && <span>{on ? "Guardada" : "Guardar"}</span>}
    </button>
  );
}
