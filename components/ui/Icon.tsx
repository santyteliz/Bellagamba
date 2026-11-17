import type { SVGProps } from "react";

/** Set de íconos de trazo fino (1.5) propio del sitio. */
const P: Record<string, React.ReactNode> = {
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  "arrow-left": <path d="M19 12H5m5 5-5-5 5-5" />,
  "arrow-up-right": <path d="M7 17 17 7M8 7h9v9" />,
  chevron: <path d="m9 6 6 6-6 6" />,
  "chevron-left": <path d="m15 6-6 6 6 6" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 8h16M4 16h10" />,
  heart: <path d="M12 20s-7.5-4.6-9.2-9.4C1.6 7.2 3.7 4 7 4c2 0 3.6 1.2 5 3 1.4-1.8 3-3 5-3 3.3 0 5.4 3.2 4.2 6.6C19.5 15.4 12 20 12 20Z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  bed: <path d="M3 18V6m0 7h18v5M3 13V11a2 2 0 0 1 2-2h5v4m11 0v-1a3 3 0 0 0-3-3h-8" />,
  bath: <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3Zm2 0V6a2 2 0 0 1 3.7-1M7 19l-1 2m11-2 1 2" />,
  rooms: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="1.5" />
      <path d="M3.5 12h8V3.5M11.5 16v4.5" />
    </>
  ),
  area: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5m11-5v5h-5M8 8l8 8m0-8-8 8" />,
  car: <path d="M5 16v2m14-2v2M3 16h18v-4l-2-5H5l-2 5v4Zm0-4h18M7 13.5h.01M17 13.5h.01" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4m8-4v4" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  coin: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.5 9.5c-.4-.9-1.4-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1.1 1.6 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1.1 0-2.1-.6-2.5-1.5M12 6.5v11" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  phone: <path d="M5 4h3.5l1.5 4.5-2.2 1.4a11 11 0 0 0 6.3 6.3l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 5.6A1.5 1.5 0 0 1 5 4Z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </>
  ),
  share: <path d="M12 15V3m-4.5 4.5L12 3l4.5 4.5M5 12v7a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-7" />,
  link: <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />,
  download: <path d="M12 4v11m-4.5-4.5L12 15l4.5-4.5M5 19.5h14" />,
  compare: <path d="M8 4v16M16 4v16M4 8h4m8 0h4M4 16h4m8 0h4" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  grid: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
    </>
  ),
  list: <path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />,
  map: <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Zm0 0v14m6-12v14" />,
  split: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <path d="M12 4.5v15" />
    </>
  ),
  filter: <path d="M4 6h16M7 12h10m-7 6h4" />,
  camera: (
    <>
      <path d="M4 8h3l1.5-2.5h7L17 8h3v11H4V8Z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  play: <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />,
  plan: <path d="M4 4h16v16H4V4Zm0 9h7m4-9v6m0 4v6m-4-7v7" />,
  cube: <path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Zm0 0v0M4 7.5l8 4.5 8-4.5M12 12v9" />,
  zoom: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2M11 8.5v5M8.5 11h5" />
    </>
  ),
  star: <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" />,
  user: (
    <>
      <circle cx="12" cy="8" r="3.8" />
      <path d="M4.5 20c.9-3.6 3.9-6 7.5-6s6.6 2.4 7.5 6" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </>
  ),
  logout: <path d="M14 4h4.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14M10 16l-4-4 4-4m-4 4h10" />,
  file: <path d="M6 3h8l5 5v13H6V3Zm8 0v5h5M9 13h7m-7 4h5" />,
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  chat: <path d="M4.5 5h15v11h-9L6 19.5V16H4.5V5Z" />,
  send: <path d="M20.5 3.5 10 14m10.5-10.5-7 17-3.5-6.5-6.5-3.5 17-7Z" />,
  bell: <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15L6 16.5ZM10 20.5a2 2 0 0 0 4 0" />,
  home: <path d="M4 10.5 12 4l8 6.5V20h-5.5v-6h-5v6H4v-9.5Z" />,
  building: <path d="M5 21V4h9v17M14 9h5v12M3 21h18M8 8h3m-3 4h3m-3 4h3" />,
  tag: <path d="M3.5 12.5v-8a1 1 0 0 1 1-1h8L21 12l-9 9-8.5-8.5ZM8 8h.01" />,
  spark: <path d="M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5m7 7L18 18M6 18l2.5-2.5m7-7L18 6" />,
  shield: <path d="M12 3 5 6v5.5c0 4.5 3 8 7 9.5 4-1.5 7-5 7-9.5V6l-7-3Zm-3 9 2 2 4-4" />,
  sliders: <path d="M4 7h10m4 0h2M4 17h4m4 0h8M14 4.5v5M8 14.5v5" />,
  printer: <path d="M7 9V3.5h10V9M7 17H4.5V9h15v8H17M7 14h10v6.5H7V14Z" />,
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 8.5-8.5M16 7l2.5 2.5M14 9l2 2" />
    </>
  ),
  calculator: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01M8.5 15h.01M12 15h.01M15.5 15h.01M8.5 18h.01M12 18h.01M15.5 18h.01" />
    </>
  ),
  trash: <path d="M5 7h14M10 7V4.5h4V7m-7 0 .8 13h8.4L17 7" />,
  upload: <path d="M12 16V4m-4.5 4.5L12 4l4.5 4.5M5 19.5h14" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17 7h.01" />
    </>
  ),
  facebook: <path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.5L17 11h-3V9a.5.5 0 0 1 .5-.5Z" />,
  linkedin: <path d="M4.5 9.5h3.5V20H4.5V9.5Zm1.75-5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM10.5 9.5h3.3V11c.5-.9 1.7-1.8 3.5-1.8 3.4 0 3.7 2.2 3.7 5V20h-3.5v-5c0-1.2 0-2.7-1.7-2.7S14 13.6 14 14.9V20h-3.5V9.5Z" />,
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10 9 5 3-5 3V9Z" />
    </>
  ),
};

export type IconName = keyof typeof P | string;

export function Icon({ name, size = 20, strokeWidth = 1.5, ...rest }: { name: IconName; size?: number; strokeWidth?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {P[name]}
    </svg>
  );
}

/** Logo oficial de WhatsApp (relleno) */
export function WhatsAppIcon({ size = 20, ...rest }: { size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01Zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28Z" />
    </svg>
  );
}
