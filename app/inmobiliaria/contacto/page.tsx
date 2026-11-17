import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { ContactSection } from "@/components/home/Sections";
import { ContactForm } from "@/components/forms/ContactForm";
import { ContactFormWithParams } from "@/components/forms/ContactFormWithParams";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Gaspar Campos 596, Vicente López. Tel. 4797-5880 · WhatsApp +54 9 11 3479-8081 · info@bellagamba.com. Lunes a viernes 9:30 a 18:30, sábados 9:30 a 13:00.",
  alternates: { canonical: "/inmobiliaria/contacto" },
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Contacto"
        crumbs={[{ label: "Inicio", href: "/inmobiliaria" }, { label: "Contacto" }]}
        lines={["Hablemos de", <span key="b" className="text-naranja-ink">tu próximo paso.</span>]}
        intro="Vender, alquilar, tasar o encontrar tu lugar: escribinos y te responde un asesor de Bellagamba."
      />
      <div className="-mt-16">
        <ContactSection
          form={
            <Suspense fallback={<ContactForm />}>
              <ContactFormWithParams />
            </Suspense>
          }
        />
      </div>
    </>
  );
}
