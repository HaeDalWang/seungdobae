import { describe, expect, test } from "vitest";
import { buildTimeline, formatTimelineDate } from "../src/lib/timeline";

describe("buildTimeline", () => {
  test("입사·자격증·첫 강의를 최신순으로 정렬한다", () => {
    const events = buildTimeline({
      experience: [{ company: "C", role: "R", startDate: "2022-01" }],
      certs: [
        { name: "A", issuedAt: "2023-07-10" },
        { name: "B", issuedAt: "2024-04-29" },
      ],
      lectureYears: [2025, 2024, 2026],
    });
    expect(events.map((e) => [e.kind, e.date])).toEqual([
      ["cert", "2024-04-29"],
      ["lecture", "2024"],
      ["cert", "2023-07-10"],
      ["join", "2022-01"],
    ]);
    expect(events[3].label).toBe("C · R");
  });

  test("milestones가 있으면 join 없이 milestone 이벤트를 만든다", () => {
    const events = buildTimeline({
      experience: [
        {
          company: "C",
          role: "R",
          startDate: "2022-01",
          milestones: [
            { date: "2022-01", title: "입사", detail: "d1" },
            { date: "2023-10", title: "이동" },
          ],
        },
      ],
      certs: [],
      lectureYears: [],
    });
    expect(events.some((e) => e.kind === "join")).toBe(false);
    expect(events.map((e) => [e.kind, e.date, e.label, e.detail])).toEqual([
      ["milestone", "2023-10", "이동", undefined],
      ["milestone", "2022-01", "입사", "d1"],
    ]);
  });

  test("endDate가 null이면 current 이벤트가 항상 최상단이다", () => {
    const events = buildTimeline({
      experience: [{ company: "C", role: "R", startDate: "2022-01", endDate: null, currentFocus: "focus" }],
      certs: [{ name: "A", issuedAt: "2030-01-01" }],
      lectureYears: [],
    });
    expect(events[0]).toEqual({ date: "", kind: "current", label: "R", detail: "focus" });
    expect(events.map((e) => e.kind)).toEqual(["current", "cert", "join"]);
  });

  test("endDate가 있으면 current 이벤트가 없다", () => {
    const events = buildTimeline({
      experience: [{ company: "C", role: "R", startDate: "2020-01", endDate: "2021-01" }],
      certs: [],
      lectureYears: [],
    });
    expect(events.map((e) => e.kind)).toEqual(["join"]);
  });

  test("날짜가 없거나 형식이 틀린 항목은 제외한다", () => {
    const events = buildTimeline({
      experience: [{ company: "C", role: "R", startDate: "" }],
      certs: [{ name: "A" }, { name: "B", issuedAt: "언젠가" }, { name: "D", issuedAt: "2023-13-01" }],
      lectureYears: [],
    });
    expect(events).toEqual([]);
  });
});

describe("formatTimelineDate", () => {
  test("원본 정밀도를 유지한다", () => {
    expect(formatTimelineDate("2024-04-29")).toBe("2024.04.29");
    expect(formatTimelineDate("2022-01")).toBe("2022.01");
    expect(formatTimelineDate("2024")).toBe("2024");
  });
});
