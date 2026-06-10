/**
 * 경력 연차 계산. careerStartDate(YYYY-MM-DD)로부터 런타임에 계산하므로
 * 빌드 없이 항상 최신값을 보여준다.
 */

const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25;

/**
 * 시작일부터 기준일(기본: 오늘)까지의 경력 연차를 반환한다.
 * - 유효하지 않은 날짜나 미래 날짜는 0을 반환한다.
 * - 표시는 "N년차" 관례를 따라 만 경과 연수 + 1 (첫 해가 1년차).
 */
export function calcCareerYears(startDate: string, now: Date = new Date()): number {
  if (!startDate) return 0;

  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return 0;

  const elapsedMs = now.getTime() - start.getTime();
  if (elapsedMs < 0) return 0;

  const fullYears = Math.floor(elapsedMs / MS_PER_YEAR);
  return fullYears + 1;
}

/**
 * 만 경과 연수(소수점 버림). "총 N년 경력" 같은 표현에 사용.
 * 미래/무효 날짜는 0.
 */
export function calcElapsedYears(startDate: string, now: Date = new Date()): number {
  if (!startDate) return 0;

  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return 0;

  const elapsedMs = now.getTime() - start.getTime();
  if (elapsedMs < 0) return 0;

  return Math.floor(elapsedMs / MS_PER_YEAR);
}
