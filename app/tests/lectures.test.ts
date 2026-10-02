import { describe, expect, test } from "vitest";
import { summarizeLectures } from "../src/lib/lectures";
import type { LectureSession } from "../src/data/types";

const s = (year: number, role: "lead" | "assist"): LectureSession => ({ year, role, topic: "t" });

describe("summarizeLectures", () => {
  test("회차 목록에서 전체·주강사·보조 횟수를 계산한다", () => {
    expect(summarizeLectures([s(2024, "lead"), s(2024, "assist"), s(2025, "lead")])).toEqual({
      total: 3,
      lead: 2,
      assist: 1,
    });
  });

  test("빈 목록은 모두 0이다", () => {
    expect(summarizeLectures([])).toEqual({ total: 0, lead: 0, assist: 0 });
  });
});
