/** Datos de marca centralizados. Lo marcado [CONFIRMAR] está listado en PENDIENTES.md */
export const SITE = {
  name: "Bellagamba",
  legalName: "Bellagamba Marketing Inmobiliario",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://bellagamba.com",
  since: 1990,
  tagline: "Más de 35 años comprometidos a ofrecer una experiencia exclusiva a nuestros clientes.",
  address: {
    street: "Gaspar Campos 596",
    city: "Vicente López",
    region: "Buenos Aires",
    postalCode: "B1638",
    country: "AR",
    // Coordenada aproximada de la oficina (Gaspar Campos 596). [CONFIRMAR punto exacto]
    lat: -34.52970,
    lng: -58.47762,
  },
  phone: "4797-5880",
  phoneHref: "tel:+541147975880",
  whatsapp: "5491134798081",
  whatsappDisplay: "+54 9 11 3479-8081",
  email: "info@bellagamba.com",
  hours: [
    { days: "Lunes a Viernes", time: "9:30 a 18:30" },
    { days: "Sábados", time: "9:30 a 13:00" },
  ],
  matriculas: "CMCPSI Nº 4500 · CUCICBA Nº 5156",
  social: {
    instagram: "https://www.instagram.com/bellagambarealestate/",
    facebook: "", // [CONFIRMAR]
    linkedin: "", // [CONFIRMAR]
    youtube: "", // [CONFIRMAR]
  },
  disclaimer:
    "Las medidas y superficies expuestas surgen de la información suministrada por el propietario, la empresa no se responsabiliza por la exactitud de las mismas.",
} as const;

export const NAV = [
  { label: "Venta", href: "/inmobiliaria/venta" },
  { label: "Alquiler", href: "/inmobiliaria/alquiler" },
  { label: "Emprendimientos", href: "/inmobiliaria/emprendimientos" },
  { label: "Búsqueda personalizada", href: "/inmobiliaria/busqueda-personalizada" },
  { label: "Tasaciones", href: "/inmobiliaria/tasacion" },
  { label: "Nosotros", href: "/inmobiliaria/nosotros" },
  { label: "Contacto", href: "/inmobiliaria/contacto" },
] as const;

export function waLink(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function yearsSince() {
  return new Date().getFullYear() - SITE.since;
}
