"use client";
import { useEffect, useRef, useState } from "react";
import type { Map as MLMap, Marker, LngLatBoundsLike } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

/** Estilo claro minimalista (CARTO Positron, sin API key). */
let workerSet = false;

export const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

export interface MapMarker {
  id: number | string;
  lat: number;
  lng: number;
  label: string;
  href?: string;
  title?: string;
  variant?: "price" | "office";
}

function circlePolygon(lat: number, lng: number, radiusM: number, steps = 64) {
  const coords: [number, number][] = [];
  const dLat = radiusM / 111320;
  const dLng = radiusM / (111320 * Math.cos((lat * Math.PI) / 180));
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    coords.push([lng + dLng * Math.cos(a), lat + dLat * Math.sin(a)]);
  }
  return { type: "Feature" as const, properties: {}, geometry: { type: "Polygon" as const, coordinates: [coords] } };
}

export default function MapView({
  markers = [],
  circle,
  center,
  zoom = 13,
  highlightedId,
  onMarkerHover,
  onMarkerClick,
  onMoveEnd,
  fit = true,
  interactive = true,
  className,
  ariaLabel = "Mapa",
}: {
  markers?: MapMarker[];
  circle?: { lat: number; lng: number; radius: number };
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  highlightedId?: number | string | null;
  onMarkerHover?: (id: number | string | null) => void;
  onMarkerClick?: (m: MapMarker) => void;
  onMoveEnd?: (bbox: [number, number, number, number], byUser: boolean) => void;
  fit?: boolean;
  interactive?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<MLMap | null>(null);
  const markerRefs = useRef<Map<string, { m: Marker; node: HTMLElement; inner: HTMLElement }>>(new Map());
  const userMoved = useRef(false);
  const [ready, setReady] = useState(false);
  const cbs = useRef({ onMarkerHover, onMarkerClick, onMoveEnd });
  cbs.current = { onMarkerHover, onMarkerClick, onMoveEnd };

  useEffect(() => {
    let disposed = false;
    (async () => {
      const ml = await import("maplibre-gl");
      if (disposed || !el.current) return;
      // El worker ESM de maplibre v6 no se resuelve con webpack: lo servimos desde /public
      if (!workerSet) {
        ml.setWorkerUrl("/vendor/maplibre/maplibre-gl-worker.mjs");
        workerSet = true;
      }
      const m = new ml.Map({
        container: el.current,
        style: MAP_STYLE,
        center: center ?? (circle ? [circle.lng, circle.lat] : [-58.48, -34.52]),
        zoom,
        attributionControl: { compact: true },
        interactive,
        cooperativeGestures: interactive ? true : undefined,
        dragRotate: false,
        pitchWithRotate: false,
      });
      if (interactive) m.addControl(new ml.NavigationControl({ showCompass: false }), "top-right");
      m.on("dragstart", () => (userMoved.current = true));
      m.on("zoomstart", (e: unknown) => {
        if ((e as unknown as { originalEvent?: Event }).originalEvent) userMoved.current = true;
      });
      m.on("moveend", () => {
        const b = m.getBounds();
        cbs.current.onMoveEnd?.([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()], userMoved.current);
      });
      m.on("load", () => {
        if (circle) {
          m.addSource("approx", { type: "geojson", data: circlePolygon(circle.lat, circle.lng, circle.radius) });
          m.addLayer({ id: "approx-fill", type: "fill", source: "approx", paint: { "fill-color": "#ef7208", "fill-opacity": 0.16 } });
          m.addLayer({ id: "approx-line", type: "line", source: "approx", paint: { "line-color": "#ef7208", "line-width": 1.5, "line-dasharray": [2, 2] } });
        }
        setReady(true);
      });
      map.current = m;
    })();
    return () => {
      disposed = true;
      map.current?.remove();
      map.current = null;
      markerRefs.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Markers
  useEffect(() => {
    const m = map.current;
    if (!m || !ready) return;
    (async () => {
      const ml = await import("maplibre-gl");
      const keep = new Set(markers.map((x) => String(x.id)));
      for (const [k, v] of markerRefs.current) if (!keep.has(k)) (v.m.remove(), markerRefs.current.delete(k));
      for (const mk of markers) {
        const key = String(mk.id);
        if (markerRefs.current.has(key)) continue;
        const node = document.createElement(mk.href ? "a" : "div");
        if (mk.href) (node as HTMLAnchorElement).href = mk.href;
        node.setAttribute("aria-label", mk.title || mk.label);
        // maplibre posiciona `node` con transform: el estilo visual va en `inner`
        const inner = document.createElement("span");
        node.appendChild(inner);
        if (mk.variant === "office") {
          inner.className = "grid size-12 place-items-center rounded-full bg-ink shadow-xl ring-4 ring-naranja/30";
          inner.innerHTML = `<span style="width:12px;height:12px;border-radius:99px;background:#ef7208;display:block"></span>`;
        } else {
          inner.className = "price-marker block whitespace-nowrap rounded-full bg-white px-2.5 py-1.5 text-[12px] font-bold text-ink shadow-[0_4px_14px_rgb(0_0_0/0.18)]";
          inner.textContent = mk.label;
          node.addEventListener("mouseenter", () => cbs.current.onMarkerHover?.(mk.id));
          node.addEventListener("mouseleave", () => cbs.current.onMarkerHover?.(null));
          node.addEventListener("click", (e) => {
            if (cbs.current.onMarkerClick) {
              e.preventDefault();
              cbs.current.onMarkerClick(mk);
            }
          });
        }
        const marker = new ml.Marker({ element: node }).setLngLat([mk.lng, mk.lat]).addTo(m);
        markerRefs.current.set(key, { m: marker, node, inner });
      }
      if (fit && markers.length && !userMoved.current) {
        if (markers.length === 1) m.jumpTo({ center: [markers[0].lng, markers[0].lat], zoom: Math.max(zoom, 14) });
        else {
          // Encuadre sin outliers (ej. Cariló): solo puntos a < 35 km de la mediana
          const med = (a: number[]) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
          const cLat = med(markers.map((x) => x.lat));
          const cLng = med(markers.map((x) => x.lng));
          const near = markers.filter((x) => Math.hypot((x.lat - cLat) * 111, (x.lng - cLng) * 92) < 35);
          const pts = near.length ? near : markers;
          const lngs = pts.map((x) => x.lng);
          const lats = pts.map((x) => x.lat);
          const b: LngLatBoundsLike = [
            [Math.min(...lngs), Math.min(...lats)],
            [Math.max(...lngs), Math.max(...lats)],
          ];
          m.fitBounds(b, { padding: 70, maxZoom: 15, duration: 0 });
        }
      }
    })();
  }, [markers, ready, fit, zoom]);

  // Hover sincronizado
  useEffect(() => {
    for (const [k, v] of markerRefs.current) {
      const on = highlightedId != null && k === String(highlightedId);
      v.inner.style.background = on ? "#141414" : "";
      v.inner.style.color = on ? "#fff" : "";
      v.inner.style.transform = on ? "scale(1.15)" : "";
      v.node.style.zIndex = on ? "5" : "";
    }
  }, [highlightedId, ready]);

  // maplibre pisa position con .maplibregl-map{position:relative}: el contenedor real va con estilo inline
  return (
    <div role="region" aria-label={ariaLabel} className={className}>
      <div ref={el} style={{ position: "absolute", inset: 0 }} />
    </div>
  );
}
