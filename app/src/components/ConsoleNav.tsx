import type { ReactNode } from "react";
import "../styles/console.css";

export interface ConsoleNavItem {
  key: string;
  text: string;
  href: string;
  icon: ReactNode;
  /** 우측 카운트 배지 (예: 저장소 수). 생략 시 미표시. */
  badge?: string;
}

export interface ConsoleNavSection {
  label: string;
  items: ConsoleNavItem[];
}

interface ConsoleNavProps {
  sections: ConsoleNavSection[];
  activeHref: string;
  onNavigate: (href: string) => void;
  /** 상단 로고 워드마크 텍스트. */
  brand: string;
}

/**
 * 핸드오프 네이비 사이드바.
 * AppLayout의 navigation 슬롯에 꽂아 반응형 드로어/모바일 동작은 Cloudscape에 맡기고,
 * 시각(네이비 배경·테라코타 활성 인디케이터·배지)은 직접 장악한다.
 */
export default function ConsoleNav({
  sections,
  activeHref,
  onNavigate,
  brand,
}: ConsoleNavProps) {
  return (
    <div id="hd-nav-host">
      <nav className="hd-nav" aria-label="콘솔 내비게이션">
        <div className="hd-nav-logo">
          <span className="hd-nav-mark" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <polygon points="8,1.5 14.2,5 14.2,11 8,14.5 1.8,11 1.8,5" />
            </svg>
          </span>
          <span className="hd-nav-word">{brand}</span>
        </div>
        {sections.map((section) => (
          <div className="hd-nav-sec" key={section.label}>
            <div className="hd-nav-lbl">{section.label}</div>
            {section.items.map((item) => {
              const isActive = activeHref === item.href;
              return (
                <button
                  key={item.key}
                  type="button"
                  className={isActive ? "hd-ni on" : "hd-ni"}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onNavigate(item.href)}
                >
                  <span className="hd-ni-ico" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="hd-ni-txt">{item.text}</span>
                  {item.badge ? <span className="hd-ni-badge">{item.badge}</span> : null}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </div>
  );
}
