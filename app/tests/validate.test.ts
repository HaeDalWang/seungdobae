import { describe, test, expect } from "vitest";
import {
  parseProfile,
  parseExperience,
  parseProjects,
  parseGithub,
  parseCredly,
  parseBlog,
} from "../src/data/validate";
import { EMPTY_PROFILE, EMPTY_GITHUB, EMPTY_CREDLY, EMPTY_BLOG } from "../src/data/types";

describe("parseProfile", () => {
  test("정상 객체를 그대로 정규화한다", () => {
    // Arrange
    const raw = {
      name: "배승도",
      title: "AWS MSP Engineer",
      bio: "소개",
      careerStartDate: "2021-01-01",
      contact: { email: "a@b.com", github: "https://github.com/x" },
    };

    // Act
    const profile = parseProfile(raw);

    // Assert
    expect(profile.name).toBe("배승도");
    expect(profile.contact.email).toBe("a@b.com");
    expect(profile.contact.linkedin).toBeUndefined();
  });

  test("객체가 아니면 빈 프로필로 폴백한다", () => {
    expect(parseProfile(null)).toEqual(EMPTY_PROFILE);
    expect(parseProfile("문자열")).toEqual(EMPTY_PROFILE);
    expect(parseProfile([])).toEqual(EMPTY_PROFILE);
  });

  test("누락 필드는 빈 문자열로 채운다", () => {
    const profile = parseProfile({ name: "배승도" });
    expect(profile.name).toBe("배승도");
    expect(profile.title).toBe("");
    expect(profile.careerStartDate).toBe("");
  });
});

describe("parseExperience", () => {
  test("배열을 정규화하고 endDate 없으면 null로 둔다", () => {
    const items = parseExperience([
      { company: "회사", role: "엔지니어", startDate: "2023-03", highlights: ["a", "b"] },
    ]);
    expect(items).toHaveLength(1);
    expect(items[0].endDate).toBeNull();
    expect(items[0].highlights).toEqual(["a", "b"]);
  });

  test("배열이 아니면 빈 배열을 반환한다", () => {
    expect(parseExperience(null)).toEqual([]);
    expect(parseExperience({})).toEqual([]);
  });

  test("company/role 모두 빈 항목은 제외한다", () => {
    const items = parseExperience([{ startDate: "2020-01" }, { company: "회사" }]);
    expect(items).toHaveLength(1);
  });

  test("highlights가 문자열 배열이 아니면 빈 배열로 처리한다", () => {
    const items = parseExperience([{ company: "회사", highlights: "not-array" }]);
    expect(items[0].highlights).toEqual([]);
  });
});

describe("parseProjects", () => {
  test("title 없는 항목은 제외한다", () => {
    const items = parseProjects([{ description: "설명만" }, { title: "프로젝트" }]);
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe("프로젝트");
  });

  test("url이 문자열이 아니면 undefined", () => {
    const items = parseProjects([{ title: "p", url: 123 }]);
    expect(items[0].url).toBeUndefined();
  });
});

describe("parseGithub", () => {
  test("정상 데이터를 정규화한다", () => {
    const data = parseGithub({
      username: "x",
      repoCount: 10,
      starCount: 5,
      languages: [{ name: "TypeScript", count: 3 }],
      recentRepos: [
        { name: "repo", description: "d", stars: 2, language: "Go", url: "u", updatedAt: "t" },
      ],
      fetchedAt: "2026-06-09T00:00:00Z",
    });
    expect(data.repoCount).toBe(10);
    expect(data.languages).toHaveLength(1);
    expect(data.recentRepos[0].name).toBe("repo");
  });

  test("객체가 아니면 빈 GitHub 데이터로 폴백한다", () => {
    expect(parseGithub(undefined)).toEqual(EMPTY_GITHUB);
  });

  test("name 없는 repo와 잘못된 숫자는 걸러낸다", () => {
    const data = parseGithub({
      repoCount: "열개",
      recentRepos: [{ description: "이름없음" }, { name: "ok", url: "u" }],
    });
    expect(data.repoCount).toBe(0);
    expect(data.recentRepos).toHaveLength(1);
  });
});

describe("parseCredly", () => {
  test("배지를 정규화하고 name 없는 항목은 제외한다", () => {
    const data = parseCredly({
      badges: [
        { id: "1", name: "SAA", issuer: "AWS", skills: ["AWS"], imageUrl: "i", url: "u", issuedAt: "2023-08-15" },
        { id: "2", issuer: "노네임" },
      ],
      fetchedAt: "t",
    });
    expect(data.badges).toHaveLength(1);
    expect(data.badges[0].name).toBe("SAA");
  });

  test("객체가 아니면 빈 Credly 데이터로 폴백한다", () => {
    expect(parseCredly("bad")).toEqual(EMPTY_CREDLY);
  });
});

describe("parseBlog", () => {
  test("title 없는 글은 제외한다", () => {
    const data = parseBlog({ posts: [{ url: "u" }, { title: "글", url: "u2" }], fetchedAt: "t" });
    expect(data.posts).toHaveLength(1);
  });

  test("객체가 아니면 빈 Blog 데이터로 폴백한다", () => {
    expect(parseBlog(null)).toEqual(EMPTY_BLOG);
  });
});
