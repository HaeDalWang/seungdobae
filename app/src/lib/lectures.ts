import type { LectureSession } from "../data/types";

export interface LectureSummary {
  total: number;
  lead: number;
  assist: number;
}

/** 회차 목록에서 횟수를 계산한다. 숫자를 따로 적지 않아 목록과 어긋나지 않는다. */
export function summarizeLectures(sessions: readonly LectureSession[]): LectureSummary {
  const lead = sessions.filter((s) => s.role === "lead").length;
  return { total: sessions.length, lead, assist: sessions.length - lead };
}
