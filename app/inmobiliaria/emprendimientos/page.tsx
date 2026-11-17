import type { Metadata } from "next";
import { DESARROLLOS } from "@/lib/desarrollos";
import { devHrefs } from "@/lib/desarrollosHrefs";
import { DevGrid } from "@/components/desarrollos/DevGrid";
import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Emprendimientos en Vicente López",
  description: "Emprendimientos y desarrollos en Vicente López y Olivos: Shulbius Kite, Roca 549 y más. Unidades en pozo, en obra y a estrenar.",
  alternates: { canonical: "/inmobiliaria/emprendimientos" },
};

export default async function Page() {
  const hrefs = await devHrefs();
  return (
    <>
      <PageHero
        eyebrow="Emprendimientos"
        crumbs={[{ label: "Inicio", href: "/inmobiliaria" }, { label: "Emprendimientos" }]}
        lines={["Invertí en lo nuevo,", <span key="b" className="text-naranja">con quien lo construye.</span>]}
        intro="Unidades en pozo, en obra y a estrenar en Vicente López. Desarrollos propios bajo la marca Shulbius."
        image={{ src: "/propiedades/12042203/01.jpg", alt: "Roca 549, piscina en la terraza" }}
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/desarrolladora" arrow>
            Conocé la Desarrolladora
          </ButtonLink>
        </div>
      </PageHero>
      <section className="container-x py-20 lg:py-28">
        <DevGrid items={DESARROLLOS} hrefs={hrefs} />
      </section>
    </>
  );
}
