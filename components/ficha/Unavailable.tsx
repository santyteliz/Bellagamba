import type { PropertyCard as Card } from "@/lib/properties/types";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icon";
import { waLink } from "@/lib/site";

/** "Esta propiedad ya no está disponible": nunca un 404 pelado. */
export function Unavailable({ similares, id, hideIntro }: { similares: Card[]; id?: string; hideIntro?: boolean }) {
  return (
    <div className="container-x pb-24 pt-32 lg:pt-40">
      {!hideIntro && (
      <div className="max-w-3xl">
        <p className="eyebrow text-naranja-text">Propiedad {id ? `#${id}` : ""}</p>
        <h1 className="mt-5 text-h1 font-light">
          Esta propiedad <span className="text-naranja-ink">ya no está disponible.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-gris-text">
          Puede que se haya vendido, alquilado o pausado. Te mostramos opciones parecidas, y si querés, la buscamos por vos (incluso propiedades que todavía no se publicaron).
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/inmobiliaria/propiedades" arrow>
            Ver todas las propiedades
          </ButtonLink>
          <ButtonLink href="/inmobiliaria/busqueda-personalizada" variant="outline">
            Búsqueda personalizada
          </ButtonLink>
          <ButtonLink href={waLink(`Hola Bellagamba! Me pasaron la propiedad ${id ?? ""} pero figura como no disponible. ¿Tienen algo similar?`)} variant="whatsapp" icon={<WhatsAppIcon size={18} />}>
            Consultar por WhatsApp
          </ButtonLink>
        </div>
      </div>
      )}
      {similares.length > 0 && (
        <section className="mt-24" aria-labelledby="sim-t">
          <h2 id="sim-t" className="text-h2 font-light">
            {hideIntro ? "Propiedades" : "Te pueden"} <span className="text-naranja-ink">{hideIntro ? "destacadas" : "interesar"}</span>
          </h2>
          <PropertyGrid items={similares} className="mt-12" />
        </section>
      )}
    </div>
  );
}
