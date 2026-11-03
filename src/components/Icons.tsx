import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function Svg(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      width="1em"
      height="1em"
      {...props}
    />
  );
}

export const IconSearch = (p: IconProps) => (
  <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Svg>
);
export const IconPin = (p: IconProps) => (
  <Svg {...p}><path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></Svg>
);
export const IconStar = (p: IconProps) => (
  <Svg {...p} fill="currentColor" stroke="none"><path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9Z" /></Svg>
);
export const IconClose = (p: IconProps) => (
  <Svg {...p}><path d="M18 6 6 18M6 6l12 12" /></Svg>
);
export const IconCheck = (p: IconProps) => (
  <Svg {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></Svg>
);
export const IconInfo = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.5v.01" /></Svg>
);
export const IconAlert = (p: IconProps) => (
  <Svg {...p}><path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v4M12 17v.01" /></Svg>
);
export const IconMenu = (p: IconProps) => (
  <Svg {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Svg>
);
export const IconArrowLeft = (p: IconProps) => (
  <Svg {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></Svg>
);
export const IconArrowRight = (p: IconProps) => (
  <Svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>
);
export const IconChevronLeft = (p: IconProps) => (
  <Svg {...p}><path d="m15 6-6 6 6 6" /></Svg>
);
export const IconChevronRight = (p: IconProps) => (
  <Svg {...p}><path d="m9 6 6 6-6 6" /></Svg>
);
export const IconCalendar = (p: IconProps) => (
  <Svg {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></Svg>
);
export const IconUsers = (p: IconProps) => (
  <Svg {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.5c1.9.8 3 2.7 3 5.5" /></Svg>
);
export const IconBed = (p: IconProps) => (
  <Svg {...p}><path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5" /><circle cx="7" cy="11" r="1.8" /></Svg>
);
export const IconRuler = (p: IconProps) => (
  <Svg {...p}><path d="M4 16 16 4l4 4L8 20Z" /><path d="m8 12 2 2M11 9l2 2M14 6l2 2" /></Svg>
);
export const IconClock = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>
);
export const IconShield = (p: IconProps) => (
  <Svg {...p}><path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6Z" /><path d="m8.5 12 2.5 2.5 4.5-4.5" /></Svg>
);
export const IconHome = (p: IconProps) => (
  <Svg {...p}><path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></Svg>
);
export const IconBuilding = (p: IconProps) => (
  <Svg {...p}><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M11 21v-3h2v3" /></Svg>
);
export const IconTicket = (p: IconProps) => (
  <Svg {...p}><path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v8a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2Z" /><path d="M13 6v12" strokeDasharray="2 2" /></Svg>
);
export const IconCopy = (p: IconProps) => (
  <Svg {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></Svg>
);
export const IconExpand = (p: IconProps) => (
  <Svg {...p}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></Svg>
);
export const IconFilter = (p: IconProps) => (
  <Svg {...p}><path d="M4 5h16l-6 7v6l-4 2v-8Z" /></Svg>
);
