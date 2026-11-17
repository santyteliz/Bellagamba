import { Suspense } from "react";
import { getAllCards } from "@/lib/properties";
import type { Operacion } from "@/lib/properties/types";
import { Listing } from "./Listing";
import { PropertyCardSkeleton } from "@/components/property/PropertyCard";

/** Server wrapper: SSR completo del listado (las rutas leen searchParams → render dinámico con filtros aplicados). */
export async function ListingPage({ locked = null }: { locked?: Operacion | null }) {
  const items = await getAllCards();
  return (
    <Suspense
      fallback={
        <div className="container-x grid gap-x-6 gap-y-12 pb-24 pt-40 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      }
    >
      <Listing items={items} locked={locked} />
    </Suspense>
  );
}
