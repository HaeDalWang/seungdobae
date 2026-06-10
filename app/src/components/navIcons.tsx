import type { ReactNode } from "react";

/**
 * 네비게이션용 인라인 SVG 아이콘.
 * 핸드오프와 동일한 stroke 스타일 (viewBox 18, stroke currentColor, width 1.5, round).
 * 외부 아이콘 의존성 없이 라인아트 일관성을 유지한다.
 */

const base = {
  viewBox: "0 0 18 18",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  width: 17,
  height: 17,
  className: "ni-ico",
};

export const iconOverview: ReactNode = (
  <svg {...base}>
    <rect x="2" y="2.5" width="6" height="6" rx="1.5" />
    <rect x="10" y="2.5" width="6" height="4" rx="1.5" />
    <rect x="2" y="11" width="6" height="4.5" rx="1.5" />
    <rect x="10" y="9" width="6" height="6.5" rx="1.5" />
  </svg>
);

export const iconExperience: ReactNode = (
  <svg {...base}>
    <rect x="2" y="5" width="14" height="10" rx="2" />
    <path d="M6.5 5V3.5a1.5 1.5 0 0 1 1.5-1.5h2a1.5 1.5 0 0 1 1.5 1.5V5" />
  </svg>
);

export const iconProjects: ReactNode = (
  <svg {...base}>
    <path d="M2 4.5a1.5 1.5 0 0 1 1.5-1.5h3l1.5 2h6A1.5 1.5 0 0 1 15.5 6.5v6A1.5 1.5 0 0 1 14 14H3.5A1.5 1.5 0 0 1 2 12.5z" />
  </svg>
);

export const iconCerts: ReactNode = (
  <svg {...base}>
    <circle cx="9" cy="7" r="4.5" />
    <path d="M6.5 10.5L5.5 16l3.5-2 3.5 2-1-5.5" />
  </svg>
);

export const iconActivity: ReactNode = (
  <svg {...base}>
    <path d="M2 12l3.5-5 3 3.5 3-6L16 9" />
  </svg>
);

export const iconContact: ReactNode = (
  <svg {...base}>
    <rect x="2" y="4" width="14" height="10" rx="2" />
    <path d="M2.5 5l6.5 4.5L15.5 5" />
  </svg>
);
