import "../styles/console.css";

interface LanguageDatum {
  name: string;
  count: number;
}

interface LanguageDonutProps {
  languages: LanguageDatum[];
  colors: string[];
}

const SIZE = 150;
const STROKE = 22;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUM = 2 * Math.PI * RADIUS;
const CENTER = SIZE / 2;

/**
 * 언어 분포 도넛 차트 — 인라인 SVG.
 * Chart.js/Recharts 대신 SVG: 핸드오프의 라인아트 일관성을 위해 (README 권장).
 * 각 세그먼트는 stroke-dasharray로 비율만큼 호를 그리고 dashoffset으로 위치시킨다.
 */
export default function LanguageDonut({ languages, colors }: LanguageDonutProps) {
  const total = languages.reduce((sum, lang) => sum + lang.count, 0);

  // 누적 비율을 따라가며 각 세그먼트의 시작 offset을 계산한다.
  let acc = 0;
  const segments = languages.map((lang, i) => {
    const fraction = total > 0 ? lang.count / total : 0;
    const dash = fraction * CIRCUM;
    const offset = acc * CIRCUM;
    acc += fraction;
    return {
      name: lang.name,
      count: lang.count,
      color: colors[i % colors.length],
      dash,
      offset,
    };
  });

  return (
    <div className="hd-donut">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label="언어 분포 도넛 차트"
      >
        {/* 트랙 */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="var(--hd-sf2)"
          strokeWidth={STROKE}
        />
        {/* 세그먼트 — 12시 방향(-90deg)부터 시계방향으로 그린다. */}
        <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
          {segments.map((seg) => (
            <circle
              key={seg.name}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke={seg.color}
              strokeWidth={STROKE}
              strokeDasharray={`${seg.dash} ${CIRCUM - seg.dash}`}
              strokeDashoffset={-seg.offset}
            />
          ))}
        </g>
        {/* 중앙 합계 */}
        <text
          className="hd-donut-center"
          x={CENTER}
          y={CENTER - 2}
          textAnchor="middle"
          fontSize="24"
          fontWeight="500"
        >
          {total}
        </text>
        <text
          className="hd-donut-center-sub"
          x={CENTER}
          y={CENTER + 15}
          textAnchor="middle"
          fontSize="10"
        >
          repos
        </text>
      </svg>

      <ul className="hd-donut-legend" style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {segments.map((seg) => (
          <li className="hd-donut-li" key={seg.name}>
            <span className="hd-donut-dot" style={{ background: seg.color }} />
            <span>{seg.name}</span>
            <b>{seg.count}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}
