import "../styles/console.css";

interface MetricCardProps {
  label: string;
  value: string;
  /** 값 뒤에 붙는 단위 (예: "년차", "%", "개"). */
  unit?: string;
  /** 하단 컬러 바 색상 토큰 (예: "var(--hd-ok)"). 생략 시 바 미표시. */
  barColor?: string;
  /** 컬러 바 채움 비율 0~100. barColor와 함께 사용. */
  barPercent?: number;
}

/**
 * 핸드오프 메트릭 카드 — Playfair Display 수치값 + 작은 단위 + 선택적 컬러 바.
 * Cloudscape KeyValuePairs 대신 커스텀: serif 숫자가 핸드오프 무드의 핵심이라서.
 */
export default function MetricCard({
  label,
  value,
  unit,
  barColor,
  barPercent = 60,
}: MetricCardProps) {
  return (
    <div className="hd-mc">
      <div className="hd-mc-lbl">{label}</div>
      <div className="hd-mc-val">
        {value}
        {unit ? <em>{unit}</em> : null}
      </div>
      {barColor ? (
        <div
          className="hd-mc-bar"
          style={{ width: `${barPercent}%`, background: barColor }}
        />
      ) : null}
    </div>
  );
}
