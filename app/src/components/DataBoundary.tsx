import StatusIndicator from "@cloudscape-design/components/status-indicator";
import Box from "@cloudscape-design/components/box";
import Spinner from "@cloudscape-design/components/spinner";
import { useStrings } from "../i18n";

interface DataBoundaryProps {
  loading: boolean;
  error: string | null;
  /** 데이터가 비었는지 여부 (로딩/에러가 아닐 때 빈 상태 표시). */
  isEmpty?: boolean;
  children: React.ReactNode;
}

/**
 * 로딩/에러/빈 상태를 일관되게 처리하는 경계 컴포넌트.
 * 에러를 숨기지 않고 사용자에게 명시적으로 표시한다.
 */
export default function DataBoundary({
  loading,
  error,
  isEmpty = false,
  children,
}: DataBoundaryProps) {
  const t = useStrings();

  if (loading) {
    return (
      <Box textAlign="center" padding="l" color="text-status-inactive">
        <Spinner size="normal" /> {t.common.loading}
      </Box>
    );
  }

  if (error) {
    return <StatusIndicator type="error">{t.common.error}</StatusIndicator>;
  }

  if (isEmpty) {
    return (
      <Box textAlign="center" padding="l" color="text-status-inactive">
        {t.common.empty}
      </Box>
    );
  }

  return <>{children}</>;
}
