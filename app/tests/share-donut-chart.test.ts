import { describe, expect, test } from "vitest";
import { groupShares, splitShares, toPercent } from "../src/components/ShareDonutChart";

describe("toPercent", () => {
  test("합계 대비 비율을 소수 첫째 자리로 반올림한다", () => {
    expect(toPercent(1, 3)).toBe(33.3);
    expect(toPercent(14, 163)).toBe(8.6);
  });

  test("합계가 0이면 0이다", () => {
    expect(toPercent(0, 0)).toBe(0);
  });
});

describe("groupShares", () => {
  test("상위 항목만 남기고 나머지와 기존 기타를 '기타 (N종)'으로 합친다", () => {
    const shares = [
      { name: "A", count: 5 },
      { name: "B", count: 9 },
      { name: "C", count: 2 },
      { name: "기타 (3종)", count: 4 },
    ];
    expect(groupShares(shares, 2)).toEqual([
      { name: "B", count: 9 },
      { name: "A", count: 5 },
      { name: "기타 (4종)", count: 6 },
    ]);
  });

  test("묶을 것이 없으면 기타를 만들지 않는다", () => {
    expect(groupShares([{ name: "A", count: 1 }], 7)).toEqual([{ name: "A", count: 1 }]);
  });

  test("합계는 보존된다", () => {
    const shares = Array.from({ length: 20 }, (_, i) => ({ name: `T${i}`, count: i + 1 }));
    const sum = (xs: { count: number }[]) => xs.reduce((s, x) => s + x.count, 0);
    expect(sum(groupShares(shares, 7))).toBe(sum(shares));
  });
});

describe("splitShares", () => {
  test("상위 limit개와 나머지의 종 수·개수를 나눈다(기존 기타의 종 수 포함)", () => {
    const shares = [
      { name: "A", count: 5 },
      { name: "B", count: 9 },
      { name: "C", count: 2 },
      { name: "기타 (3종)", count: 4 },
    ];
    expect(splitShares(shares, 2)).toEqual({
      top: [
        { name: "B", count: 9 },
        { name: "A", count: 5 },
      ],
      rest: { kinds: 4, count: 6 },
    });
  });
});
