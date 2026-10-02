import type { ReactNode } from "react";
import Box from "@cloudscape-design/components/box";
import ExpandableSection from "@cloudscape-design/components/expandable-section";

interface DetailToggleProps {
  title: string;
  children: ReactNode;
}

/** 눌러서 펼치는 상세 영역. 기본은 접힘, 내용은 작은 글씨로 보여준다. */
export default function DetailToggle({ title, children }: DetailToggleProps) {
  return (
    <ExpandableSection variant="footer" headerText={title}>
      <Box variant="small" color="text-body-secondary">
        {children}
      </Box>
    </ExpandableSection>
  );
}
