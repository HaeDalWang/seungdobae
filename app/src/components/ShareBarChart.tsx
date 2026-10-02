import BarChart from "@cloudscape-design/components/bar-chart";
import Box from "@cloudscape-design/components/box";

import type { TechShare } from "../data/types";

/** 막대 한 줄의 세로 높이(px). 항목 수에 비례해 차트 높이를 정한다. */
const ROW_HEIGHT = 30;
const AXIS_PADDING = 60;

/** 합계 대비 비율(%)을 소수 첫째 자리까지 계산한다. */
export function toPercent(count: number, total: number): number {
  return total === 0 ? 0 : Math.round((count / total) * 1000) / 10;
}

interface ShareBarChartProps {
  title: string;
  shares: TechShare[];
  /** 툴팁/시리즈 이름. */
  label: string;
}

/** 항목별 개수를 합계 대비 비율(%)의 가로 막대로 보여준다. */
export default function ShareBarChart({ title, shares, label }: ShareBarChartProps) {
  const total = shares.reduce((sum, s) => sum + s.count, 0);

  return (
    <BarChart
      series={[
        {
          title: label,
          type: "bar",
          data: shares.map((s) => ({ x: s.name, y: toPercent(s.count, total) })),
          valueFormatter: (value) => `${value}%`,
        },
      ]}
      xScaleType="categorical"
      horizontalBars
      hideLegend
      hideFilter
      height={shares.length * ROW_HEIGHT + AXIS_PADDING}
      ariaLabel={title}
      empty={<Box color="text-status-inactive">—</Box>}
    />
  );
}
