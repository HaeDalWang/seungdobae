import { describe, test, expect } from "vitest";
import { isGithubUrl } from "../src/lib/link";

describe("isGithubUrl", () => {
  test("github.com 저장소 url이면 true를 반환한다", () => {
    // Arrange
    const url = "https://github.com/HaeDalWang/k8s-upgrade-skills";

    // Act
    const result = isGithubUrl(url);

    // Assert
    expect(result).toBe(true);
  });

  test("뉴스 기사 url이면 false를 반환한다", () => {
    expect(isGithubUrl("https://n.news.naver.com/article/008/0005212213")).toBe(false);
  });

  test("ddaily 기사 url이면 false를 반환한다", () => {
    expect(isGithubUrl("https://www.ddaily.co.kr/page/view/2023062216520189531")).toBe(false);
  });

  test("url이 undefined이면 false를 반환한다", () => {
    expect(isGithubUrl(undefined)).toBe(false);
  });

  test("url이 빈 문자열이면 false를 반환한다", () => {
    expect(isGithubUrl("")).toBe(false);
  });

  test("유효하지 않은 url이면 false를 반환한다", () => {
    expect(isGithubUrl("not a url")).toBe(false);
  });

  test("github.com을 사칭한 다른 도메인은 false를 반환한다", () => {
    // github.com.evil.com 같은 서브도메인 사칭 방지
    expect(isGithubUrl("https://github.com.evil.com/foo")).toBe(false);
  });
});
