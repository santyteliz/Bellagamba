import clsx from "clsx";
import type { PropertyCard as Card } from "@/lib/properties/types";
import { PropertyCard } from "./PropertyCard";

export function PropertyGrid({ items, className }: { items: Card[]; className?: string }) {
  return (
    <div className={clsx("grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3", className)}>
      {items.map((p) => (
        <PropertyCard key={p.id} p={p} />
      ))}
    </div>
  );
}
