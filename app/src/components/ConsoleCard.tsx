import type { ReactNode } from "react";
import "../styles/console.css";

interface ConsoleCardProps {
  title?: string;
  /** 제목 아래 작은 부제. */
  subtitle?: string;
  /** 헤더 우측 슬롯 (범례, 액션 등). */
  actions?: ReactNode;
  children: ReactNode;
  /** 본문 패딩 제거 — 테이블처럼 가장자리까지 채우는 콘텐츠용. */
  flushBody?: boolean;
}

/**
 * 핸드오프 콘솔 카드 — serif 타이틀 + 경계선 헤더 + 본문.
 * Cloudscape Container 대신 커스텀: 베이지 표면·웜 보더·serif 헤딩 무드를 위해.
 */
export default function ConsoleCard({
  title,
  subtitle,
  actions,
  children,
  flushBody = false,
}: ConsoleCardProps) {
  const hasHeader = Boolean(title || actions);
  return (
    <div className="hd-card">
      {hasHeader ? (
        <div className="hd-card-h">
          <div style={{ minWidth: 0 }}>
            {title ? <h2 className="hd-card-t">{title}</h2> : null}
            {subtitle ? <div className="hd-card-s">{subtitle}</div> : null}
          </div>
          {actions ? <div className="hd-card-actions">{actions}</div> : null}
        </div>
      ) : null}
      <div style={flushBody ? undefined : { padding: "14px 17px" }}>{children}</div>
    </div>
  );
}
