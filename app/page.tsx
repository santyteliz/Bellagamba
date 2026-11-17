import type { Metadata } from "next";
import { Intro } from "@/components/intro/Intro";

export const metadata: Metadata = {
  title: { absolute: "Bellagamba Marketing Inmobiliario · Inmobiliaria y Desarrolladora en Zona Norte" },
  alternates: { canonical: "/" },
  openGraph: { images: [{ url: "/propiedades/14338622/02.jpg", width: 1600, height: 1200 }] },
};

export default function Home() {
  return <Intro />;
}
