/**
 * 경력 타임라인. 데이터에 날짜가 있는 사실만 이벤트로 만든다 — 날짜 없는 항목은 지어내지 않고 뺀다.
 */

export type TimelineKind = "current" | "milestone" | "join" | "cert" | "lecture";

export interface TimelineEvent {
  /** 데이터 원본의 정밀도 그대로: YYYY, YYYY-MM, YYYY-MM-DD. current는 빈 문자열(뷰가 "현재"로 표시). */
  date: string;
  kind: TimelineKind;
  /** 데이터에서 온 이름(회사·역할, 자격증 이름). 첫 강의는 빈 문자열. */
  label: string;
  /** milestone의 detail, current의 currentFocus. */
  detail?: string;
}

export interface TimelineInput {
  experience: readonly {
    company: string;
    role: string;
    startDate: string;
    endDate?: string | null;
    milestones?: readonly { date: string; title: string; detail?: string }[];
    currentFocus?: string;
  }[];
  certs: readonly { name: string; issuedAt?: string }[];
  lectureYears: readonly number[];
}

const DATE = /^\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/;

function isDate(value: string | undefined): value is string {
  return typeof value === "string" && DATE.test(value);
}

/** 현재(맨 위)·직무 단계(없으면 입사)·자격증 취득·첫 세미나 강의를 최신순으로 반환한다. */
export function buildTimeline({ experience, certs, lectureYears }: TimelineInput): TimelineEvent[] {
  const current = experience
    .filter((e) => e.endDate === null)
    .map((e): TimelineEvent => ({ date: "", kind: "current", label: e.role, detail: e.currentFocus }));
  const career = experience.flatMap((e): TimelineEvent[] => {
    const milestones = (e.milestones ?? []).filter((m) => isDate(m.date) && m.title !== "");
    if (milestones.length > 0) {
      return milestones.map((m) => ({ date: m.date, kind: "milestone", label: m.title, detail: m.detail }));
    }
    return isDate(e.startDate) ? [{ date: e.startDate, kind: "join", label: `${e.company} · ${e.role}` }] : [];
  });
  const certified = certs
    .filter((c) => isDate(c.issuedAt))
    .map((c): TimelineEvent => ({ date: c.issuedAt as string, kind: "cert", label: c.name }));
  const years = lectureYears.filter((y) => Number.isInteger(y) && y > 0);
  const firstLecture: TimelineEvent[] =
    years.length > 0 ? [{ date: String(Math.min(...years)), kind: "lecture", label: "" }] : [];

  // 같은 해 안에서는 "2024" < "2024-04-29" 이므로 정밀도 낮은 날짜가 뒤(오래된 쪽)로 간다.
  const past = [...career, ...certified, ...firstLecture].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return [...current, ...past];
}

/** "2024-04-29" → "2024.04.29", "2022-01" → "2022.01", "2024" → "2024". */
export function formatTimelineDate(date: string): string {
  return date.replace(/-/g, ".");
}
