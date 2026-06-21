interface IconProps {
  size?: number;
}
const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const IconHome = ({ size = 19 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M9.5 21v-6h5v6" />
  </svg>
);
export const IconPeople = ({ size = 19 }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.5a3 3 0 0 1 0 6" />
    <path d="M17.5 20a5.5 5.5 0 0 0-3-4.9" />
  </svg>
);
export const IconSegment = ({ size = 19 }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="6.5" cy="7" r="3" />
    <circle cx="17.5" cy="7" r="3" />
    <circle cx="12" cy="17" r="3" />
    <path d="M9 8.5 15 8.5M8 9.5l2.5 5M16 9.5 13.5 14.5" />
  </svg>
);
export const IconUpload = ({ size = 19 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M12 15V4" />
    <path d="m8 8 4-4 4 4" />
    <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
  </svg>
);
export const IconSearch = ({ size = 17 }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);
export const IconArrowLeft = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M19 12H5" />
    <path d="m11 6-6 6 6 6" />
  </svg>
);
export const IconExternal = ({ size = 15 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M14 4h6v6" />
    <path d="M20 4 10 14" />
    <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
  </svg>
);
export const IconExport = ({ size = 16 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M12 4v11" />
    <path d="m8 11 4 4 4-4" />
    <path d="M5 19h14" />
  </svg>
);
export const IconSpark = ({ size = 16 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    <path d="M12 8.5 13.2 11l2.3 1-2.3 1-1.2 2.5L10.8 13 8.5 12l2.3-1z" />
  </svg>
);
