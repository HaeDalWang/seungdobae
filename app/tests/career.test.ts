import { describe, test, expect } from "vitest";
import { calcCareerYears, calcElapsedYears } from "../src/lib/career";

describe("calcCareerYears", () => {
  test("첫 해는 1년차를 반환한다", () => {
    // Arrange
    const start = "2026-01-01";
    const now = new Date("2026-06-01");

    // Act
    const years = calcCareerYears(start, now);

    // Assert
    expect(years).toBe(1);
  });

  test("만 1년이 지나면 2년차를 반환한다", () => {
    const years = calcCareerYears("2024-01-01", new Date("2025-06-01"));
    expect(years).toBe(2);
  });

  test("빈 문자열이면 0을 반환한다", () => {
    expect(calcCareerYears("", new Date("2026-06-01"))).toBe(0);
  });

  test("유효하지 않은 날짜면 0을 반환한다", () => {
    expect(calcCareerYears("not-a-date", new Date("2026-06-01"))).toBe(0);
  });

  test("미래 시작일이면 0을 반환한다", () => {
    expect(calcCareerYears("2030-01-01", new Date("2026-06-01"))).toBe(0);
  });
});

describe("calcElapsedYears", () => {
  test("만 경과 연수를 버림으로 반환한다", () => {
    expect(calcElapsedYears("2021-01-01", new Date("2026-06-01"))).toBe(5);
  });

  test("1년 미만이면 0을 반환한다", () => {
    expect(calcElapsedYears("2026-01-01", new Date("2026-06-01"))).toBe(0);
  });

  test("무효 날짜면 0을 반환한다", () => {
    expect(calcElapsedYears("xyz", new Date("2026-06-01"))).toBe(0);
  });
});
