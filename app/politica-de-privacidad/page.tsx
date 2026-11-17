import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  alternates: { canonical: "/politica-de-privacidad" },
};

const SECTIONS: [string, string[]][] = [
  ["Responsable", [`${SITE.legalName}, con domicilio en ${SITE.address.street}, ${SITE.address.city}, Provincia de Buenos Aires. Contacto: ${SITE.email}. [CONFIRMAR razón social y CUIT]`]],
  [
    "Qué datos recolectamos",
    [
      "Los que nos das en los formularios (nombre, email, teléfono, datos de la propiedad o de tu búsqueda, mensajes y, si las adjuntás, fotos).",
      "Datos técnicos de navegación y, solo si aceptás todas las cookies, datos de medición (Google Analytics 4 y Meta Pixel).",
      "Preferencias guardadas en tu propio dispositivo (favoritos, comparador, búsquedas guardadas y vistas recientes). No salen de tu navegador.",
    ],
  ],
  ["Para qué los usamos", ["Responder consultas, coordinar visitas, realizar tasaciones, buscar propiedades para vos y, si te suscribís, enviarte novedades. No vendemos ni cedemos tus datos a terceros con fines comerciales."]],
  ["Cookies", ["Usamos cookies necesarias para el funcionamiento del sitio. Las de medición y publicidad se activan únicamente si elegís “Aceptar todas”. Podés cambiar tu elección borrando los datos del sitio en tu navegador."]],
  ["Tus derechos", ["Podés acceder, rectificar, actualizar o suprimir tus datos escribiendo a " + SITE.email + ", conforme a la Ley 25.326 de Protección de Datos Personales. La Agencia de Acceso a la Información Pública es el órgano de control de la Ley 25.326."]],
  ["Conservación y seguridad", ["Conservamos los datos el tiempo necesario para la finalidad para la que fueron recolectados y aplicamos medidas razonables de seguridad para protegerlos."]],
];

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Legal" crumbs={[{ label: "Inicio", href: "/inmobiliaria" }, { label: "Política de privacidad" }]} lines={["Política de", <span key="b" className="text-naranja-ink">privacidad.</span>]} intro="[CONFIRMAR] Texto base a revisar por el asesor legal del cliente." />
      <div className="container-x pb-28">
        <div className="max-w-3xl space-y-12">
          {SECTIONS.map(([t, ps]) => (
            <section key={t}>
              <h2 className="text-h3 font-light">{t}</h2>
              <div className="mt-4 space-y-3 text-[16px] leading-relaxed text-ink/80">
                {ps.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          ))}
          <p className="text-sm text-gris-text">Matrículas: {SITE.matriculas}</p>
        </div>
      </div>
    </>
  );
}
