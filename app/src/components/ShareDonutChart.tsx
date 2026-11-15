import PieChart from "@cloudscape-design/components/pie-chart";
import Box from "@cloudscape-design/components/box";

import type { TechShare } from "../data/types";

/** 도넛에 이름을 붙여 보여줄 최대 항목 수. 나머지는 "기타"로 묶는다. */
export const DONUT_TOP = 7;

/** 수집 스크립트(tech-map.mjs)가 쓰는 "기타" 표기. "기타 (N종)" 형식을 그대로 잇는다. */
const OTHER = "기타";
const OTHER_KINDS = /\((\d+)종\)/;

/** 합계 대비 비율(%)을 소수 첫째 자리까지 계산한다. */
export function toPercent(count: number, total: number): number {
  return total === 0 ? 0 : Math.round((count / total) * 1000) / 10;
}

export interface SplitShares {
  top: TechShare[];
  /** 상위에 들지 못한 항목 + 기존 "기타"의 합. 기존 "기타 (N종)"의 종 수도 합산한다. */
  rest: { kinds: number; count: number };
}

/** 개수 상위 limit개와 나머지(종 수·개수)로 나눈다. */
export function splitShares(shares: TechShare[], limit: number): SplitShares {
  const isOther = (s: TechShare) => s.name.startsWith(OTHER);
  const named = shares.filter((s) => !isOther(s)).sort((a, b) => b.count - a.count);
  const rolled = [...named.slice(limit), ...shares.filter(isOther)];
  const count = rolled.reduce((sum, s) => sum + s.count, 0);
  const kinds = rolled.reduce(
    (sum, s) => sum + (isOther(s) ? Number(OTHER_KINDS.exec(s.name)?.[1] ?? 0) : 1),
    0,
  );
  return { top: named.slice(0, limit), rest: { kinds, count } };
}

/** 개수 상위 limit개 + 나머지를 "기타 (N종)" 하나로 묶는다. 기존 "기타"의 종 수도 합산한다. */
export function groupShares(shares: TechShare[], limit: number): TechShare[] {
  const { top, rest } = splitShares(shares, limit);
  if (rest.count === 0) return top;
  const name = rest.kinds > 0 ? `${OTHER} (${rest.kinds}종)` : OTHER;
  return [...top, { name, count: rest.count }];
}

interface ShareDonutChartProps {
  title: string;
  shares: TechShare[];
}

/** 항목별 비율을 도넛으로 보여준다. 항목이 많아도 높이가 일정하다. */
export default function ShareDonutChart({ title, shares }: ShareDonutChartProps) {
  const total = shares.reduce((sum, s) => sum + s.count, 0);

  return (
    <PieChart
      variant="donut"
      size="medium"
      data={groupShares(shares, DONUT_TOP).map((s) => ({ title: s.name, value: s.count }))}
      segmentDescription={(datum) => `${toPercent(datum.value, total)}%`}
      hideFilter
      ariaLabel={title}
      empty={<Box color="text-status-inactive">—</Box>}
    />
  );
}
