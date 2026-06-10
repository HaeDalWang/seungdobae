/** 한국어 날짜/숫자 포맷 헬퍼. */

const MONTH = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

/** "YYYY-MM" 또는 "YYYY-MM-DD" → "YYYY년 M월". 무효 시 원본 반환. */
export function formatYearMonth(value: string): string {
  if (!value) return "";
  const match = value.match(/^(\d{4})-(\d{2})/);
  if (!match) return value;
  const year = match[1];
  const monthIndex = Number(match[2]) - 1;
  if (monthIndex < 0 || monthIndex > 11) return value;
  return `${year}년 ${MONTH[monthIndex]}`;
}

/** ISO 8601 → "YYYY.MM.DD". 무효 시 원본 반환. */
export function formatDate(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

/** 천 단위 구분 숫자. */
export function formatNumber(value: number): string {
  return value.toLocaleString("ko-KR");
}
