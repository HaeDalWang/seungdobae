import BarChart from "@cloudscape-design/components/bar-chart";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";

import type { TechShare } from "../data/types";
import { useStrings } from "../i18n";
import { splitShares, toPercent } from "./ShareDonutChart";

/** 막대로 이름을 붙여 보여줄 최대 항목 수. 나머지는 차트 아래 한 줄로 요약한다. */
export const BAR_TOP = 10;

/** 막대 한 줄의 세로 높이(px). 항목 수에 비례해 차트 높이를 정한다. */
const ROW_HEIGHT = 30;
const AXIS_PADDING = 60;

interface ShareBarChartProps {
  title: string;
  shares: TechShare[];
}

/** 상위 BAR_TOP개를 합계 대비 비율(%)의 가로 막대로, 나머지는 "나머지 N종 · X%" 한 줄로 보여준다. */
export default function ShareBarChart({ title, shares }: ShareBarChartProps) {
  const t = useStrings();
  const total = shares.reduce((sum, s) => sum + s.count, 0);
  const { top, rest } = splitShares(shares, BAR_TOP);

  return (
    <SpaceBetween size="xs">
      <BarChart
        series={[
          {
            title,
            type: "bar",
            data: top.map((s) => ({ x: s.name, y: toPercent(s.count, total) })),
            valueFormatter: (value) => `${value}%`,
          },
        ]}
        xScaleType="categorical"
        yTickFormatter={(value) => `${value}%`}
        horizontalBars
        hideLegend
        hideFilter
        height={top.length * ROW_HEIGHT + AXIS_PADDING}
        ariaLabel={title}
        empty={<Box color="text-status-inactive">—</Box>}
      />
      {rest.count > 0 ? (
        <Box variant="small" color="text-body-secondary">
          {t.overview.techRest}
          {rest.kinds > 0 ? ` ${rest.kinds}${t.overview.techKindsUnit}` : ""} · {toPercent(rest.count, total)}%
        </Box>
      ) : null}
    </SpaceBetween>
  );
}
