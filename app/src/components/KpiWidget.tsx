import Box from "@cloudscape-design/components/box";

interface KpiWidgetProps {
  /** 큰 숫자 값. */
  value: string;
  /** 값 아래 라벨. */
  label: string;
  /** 값 뒤 단위 (예: "년차"). */
  unit?: string;
}

/** 콘솔 대시보드식 KPI 표시. 큰 값 + 라벨. */
export default function KpiWidget({ value, label, unit }: KpiWidgetProps) {
  return (
    <div>
      <Box variant="awsui-key-label">{label}</Box>
      <Box fontSize="display-l" fontWeight="bold">
        {value}
        {unit ? (
          <Box variant="span" fontSize="heading-m" fontWeight="normal" color="text-body-secondary">
            {" "}
            {unit}
          </Box>
        ) : null}
      </Box>
    </div>
  );
}
