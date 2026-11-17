import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { PageTransition } from "@/components/layout/PageTransition";
import { Preloader, preloaderScript } from "@/components/layout/Preloader";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Analytics } from "@/components/layout/Analytics";
import { Toaster } from "@/components/layout/Toaster";
import { FooterGate } from "@/components/layout/FooterGate";

const manrope = Manrope({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Bellagamba Marketing Inmobiliario · Zona Norte desde 1990",
    template: "%s · Bellagamba",
  },
  description:
    "Inmobiliaria moderna, 100% dedicada a nuestros clientes. Casas, departamentos, PH y terrenos en venta y alquiler en Vicente López, Olivos, Florida, Martínez y Zona Norte. Más de 35 años de trayectoria.",
  applicationName: "Bellagamba",
  keywords: ["inmobiliaria Vicente López", "propiedades Zona Norte", "casas en venta Olivos", "departamentos Vicente López", "tasaciones", "Shulbius"],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Bellagamba Marketing Inmobiliario",
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f5f3ef",
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: SITE.legalName,
  url: SITE.url,
  logo: `${SITE.url}/marca/logo-bellagamba.png`,
  image: `${SITE.url}/marca/logo-bellagamba.png`,
  telephone: "+54 11 4797-5880",
  email: SITE.email,
  foundingDate: String(SITE.since),
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: SITE.address.lat, longitude: SITE.address.lng },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:30", closes: "18:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:30", closes: "13:00" },
  ],
  sameAs: Object.values(SITE.social).filter(Boolean),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={manrope.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloaderScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body className="min-h-dvh">
        <Preloader />
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <FooterGate>
          <Footer />
        </FooterGate>
        <WhatsAppFloat />
        <CookieBanner />
        <Toaster />
        <PageTransition />
        <CustomCursor />
        <SmoothScroll />
        <Analytics />
      </body>
    </html>
  );
}
