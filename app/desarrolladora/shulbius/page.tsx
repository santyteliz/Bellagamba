import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import { DESARROLLOS } from "@/lib/desarrollos";
import { devHrefs } from "@/lib/desarrollosHrefs";
import { getPropertyById } from "@/lib/properties";
import { DevGrid } from "@/components/desarrollos/DevGrid";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ShulbiusMark } from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/ui/Icon";
import { formatPrice } from "@/lib/format";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shulbius · Desarrollos premium en Vicente López",
  description: "Shulbius, la marca de desarrollos premium de Bellagamba en Vicente López: Kite, Mill3, Drei, Emme, Doc y Dream.",
  alternates: { canonical: "/desarrolladora/shulbius" },
};

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default async function Page() {
  const hrefs = await devHrefs();
  const kite = await getPropertyById(13113629);
  const shul = DESARROLLOS.filter((x) => x.marca === "Shulbius");
  // Fotos de Kite sin el plano (06.jpg es una planta)
  const fotos = kite ? kite.fotos.slice(0, 3) : [];
  return (
    <div className="on-dark bg-ink text-white">
      <section className="flex min-h-[90svh] flex-col items-center justify-center px-4 pb-16 pt-36 text-center">
        <ShulbiusMark className="hero-fade h-24 w-auto text-naranja" />
        <h1 className="hero-fade mt-12 text-[clamp(2.4rem,1rem+6vw,6rem)] font-light uppercase leading-none tracking-shulbius" style={d(200)}>
          Shulbius
        </h1>
        <p className="hero-fade mt-6 text-[12px] uppercase tracking-shulbius text-white/70" style={d(350)}>
          Vicente López · Desarrollos
        </p>
        <p className="hero-fade mx-auto mt-12 max-w-xl text-lg leading-relaxed text-white/70" style={d(500)}>
          Arquitectura contemporánea, materiales nobles y foco en la calidad de vida. Una marca de Bellagamba Desarrolladora.
        </p>
      </section>

      {kite && (
        <section className="pb-24 lg:pb-36" aria-labelledby="kite-t">
          <div className="container-x">
            <div className="grid gap-3 md:grid-cols-3 md:grid-rows-2">
              {fotos.map((f, i) => (
                <Reveal kind="clip" key={f} delay={i * 120} className={`relative overflow-hidden rounded-[var(--radius-card)] ${i === 0 ? "aspect-[4/3] md:col-span-2 md:row-span-2 md:aspect-auto" : "aspect-[4/3]"}`}>
                  <Image src={f} alt={i === 0 ? "Shulbius Kite" : ""} fill sizes={i === 0 ? "66vw" : "33vw"} className="object-cover" placeholder={kite.blur[f] ? "blur" : "empty"} blurDataURL={kite.blur[f]} />
                </Reveal>
              ))}
            </div>
            <div className="mt-14 grid gap-10 lg:grid-cols-2">
              <div>
                <p className="text-[12px] uppercase tracking-shulbius text-naranja">Shulbius Kite</p>
                <RevealLines id="kite-t" className="mt-6 text-h2 font-light" lines={[kite.direccion, <span key="b" className="text-white/60">{kite.barrio}, Vicente López</span>]} />
              </div>
              <Reveal kind="fade" className="space-y-5 text-white/70">
                <p>{kite.parrafos.slice(0, 2).join(" ")}</p>
                <p className="text-white">
                  Unidad disponible: {kite.ambientes} ambientes · <strong className="font-semibold text-naranja">{formatPrice(kite.precio, kite.moneda)}</strong>
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <ButtonLink href={kite.href} arrow>
                    Ver la unidad
                  </ButtonLink>
                  <ButtonLink href={waLink("Hola! Quiero información sobre Shulbius Kite.")} variant="outline-light" icon={<WhatsAppIcon size={16} />}>
                    Consultar
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-white/10 py-24 lg:py-36">
        <div className="container-x">
          <p className="text-[12px] uppercase tracking-shulbius text-white/70">La colección</p>
          <RevealLines className="mb-12 mt-6 text-h2 font-light" lines={["Kite, Mill3, Drei,", <span key="b" className="text-naranja">Emme, Doc, Dream.</span>]} />
          <DevGrid items={shul} hrefs={hrefs} dark />
        </div>
      </section>
    </div>
  );
}
