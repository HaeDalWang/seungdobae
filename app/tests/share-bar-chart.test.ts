import { describe, expect, test } from "vitest";
import { toPercent } from "../src/components/ShareBarChart";

describe("toPercent", () => {
  test("합계 대비 비율을 소수 첫째 자리로 반올림한다", () => {
    expect(toPercent(1, 3)).toBe(33.3);
    expect(toPercent(14, 163)).toBe(8.6);
  });

  test("합계가 0이면 0이다", () => {
    expect(toPercent(0, 0)).toBe(0);
  });
});
