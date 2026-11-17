import type { Metadata } from "next";
import { DESARROLLOS } from "@/lib/desarrollos";
import { devHrefs } from "@/lib/desarrollosHrefs";
import { DevGrid } from "@/components/desarrollos/DevGrid";
import { RevealLines } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Desarrollos en pozo, en obra y terminados",
  description: "Desarrollos de Bellagamba y Shulbius en Vicente López, por etapa: en pozo, en obra y terminados.",
  alternates: { canonical: "/desarrolladora/desarrollos" },
};

export default async function Page() {
  const hrefs = await devHrefs();
  return (
    <div className="on-dark min-h-screen bg-ink pb-28 pt-36 text-white lg:pt-44">
      <div className="container-x">
        <p className="text-[12px] uppercase tracking-shulbius text-naranja">Desarrolladora</p>
        <RevealLines as="h1" className="mb-14 mt-6 text-h1 font-light" lines={["Nuestros", <span key="b" className="text-naranja">desarrollos.</span>]} />
        <DevGrid items={DESARROLLOS} hrefs={hrefs} dark />
      </div>
    </div>
  );
}
