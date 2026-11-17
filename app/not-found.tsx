import { getAllCards } from "@/lib/properties";
import { Unavailable } from "@/components/ficha/Unavailable";
import { ButtonLink } from "@/components/ui/Button";

export default async function NotFound() {
  const featured = (await getAllCards()).filter((p) => p.destacada).slice(0, 3);
  return (
    <>
      <div className="container-x pt-36 lg:pt-44">
        <p className="eyebrow text-naranja-text">Error 404</p>
        <h1 className="mt-5 max-w-3xl text-h1 font-light">
          Esta página no existe, <span className="text-naranja-ink">pero tu próximo hogar sí.</span>
        </h1>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/inmobiliaria" arrow>
            Ir al inicio
          </ButtonLink>
          <ButtonLink href="/inmobiliaria/propiedades" variant="outline">
            Ver propiedades
          </ButtonLink>
        </div>
      </div>
      <div className="-mt-24">
        <Unavailable similares={featured} hideIntro />
      </div>
    </>
  );
}
