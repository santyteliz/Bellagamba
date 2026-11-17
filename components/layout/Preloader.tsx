/* eslint-disable @next/next/no-img-element */
/**
 * Preloader con el logo: solo en la intro (/) en la primera visita de la sesión, máx ~1 s (100% CSS).
 * El script inline del <head> marca html[data-seen] si ya se vio o si no es la intro (no tocamos el LCP de home, listado ni ficha).
 */
export function Preloader() {
  return (
    <div id="preloader" aria-hidden="true" className="fixed inset-0 z-[100] grid place-items-center bg-crema">
      <div className="flex flex-col items-center gap-5">
        <img src="/marca/logo-bellagamba.svg" alt="" width={153} height={20} className="pre-logo w-48" />
        <div className="h-px w-48 overflow-hidden bg-ink/10">
          <div className="pre-bar h-full w-full origin-left bg-naranja" />
        </div>
      </div>
    </div>
  );
}

export const preloaderScript = `(function(){try{var d=document.documentElement;d.classList.add('js');var p=location.pathname;if(p!=='/'||sessionStorage.getItem('bg:pre')||matchMedia('(prefers-reduced-motion: reduce)').matches){d.setAttribute('data-seen','')}else{sessionStorage.setItem('bg:pre','1')}}catch(e){document.documentElement.setAttribute('data-seen','')}})();`;
