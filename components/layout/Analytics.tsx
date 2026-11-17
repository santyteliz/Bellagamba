"use client";
import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { consentStore } from "@/lib/store";

const GA = process.env.NEXT_PUBLIC_GA4_ID;
const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/** GA4 + Meta Pixel: solo se cargan si hay ID configurado Y el visitante eligió "Aceptar todas". */
export function Analytics() {
  const consent = consentStore.use();
  const pathname = usePathname();
  const allowed = consent?.status === "all";

  useEffect(() => {
    if (!allowed) return;
    window.gtag?.("event", "page_view", { page_path: pathname });
    window.fbq?.("track", "PageView");
  }, [pathname, allowed]);

  if (!allowed) return null;
  return (
    <>
      {GA && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('consent','default',{ad_storage:'granted',analytics_storage:'granted'});gtag('config','${GA}',{send_page_view:false});`}</Script>
        </>
      )}
      {PIXEL && (
        <Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL}');`}</Script>
      )}
    </>
  );
}
