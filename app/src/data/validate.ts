/**
 * 런타임 데이터 검증. public/data/*.json은 외부 입력이므로 신뢰하지 않는다.
 * 형태가 어긋나면 빈 상태 fallback으로 안전하게 떨어진다.
 *
 * 의존성 없이 가벼운 타입 가드로 구현한다 (KISS).
 */
import {
  type Profile,
  type ExperienceItem,
  type ProjectItem,
  type GithubData,
  type GithubRepo,
  type LanguageStat,
  type CredlyData,
  type CredlyBadge,
  type BlogData,
  type BlogPost,
  EMPTY_PROFILE,
  EMPTY_GITHUB,
  EMPTY_CREDLY,
  EMPTY_BLOG,
} from "./types";

type Rec = Record<string, unknown>;

function isObject(v: unknown): v is Rec {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}
function num(v: unknown, fallback = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}
function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}
function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

/* ===== 수동 데이터 ===== */

export function parseProfile(raw: unknown): Profile {
  if (!isObject(raw)) return EMPTY_PROFILE;
  const contact = isObject(raw.contact) ? raw.contact : {};
  return {
    name: str(raw.name),
    title: str(raw.title),
    bio: str(raw.bio),
    careerStartDate: str(raw.careerStartDate),
    contact: {
      email: typeof contact.email === "string" ? contact.email : undefined,
      github: typeof contact.github === "string" ? contact.github : undefined,
      linkedin: typeof contact.linkedin === "string" ? contact.linkedin : undefined,
      location: typeof contact.location === "string" ? contact.location : undefined,
    },
  };
}

export function parseExperience(raw: unknown): ExperienceItem[] {
  return asArray(raw)
    .filter(isObject)
    .map((item) => ({
      company: str(item.company),
      role: str(item.role),
      startDate: str(item.startDate),
      endDate: typeof item.endDate === "string" ? item.endDate : null,
      highlights: strArray(item.highlights),
    }))
    .filter((item) => item.company !== "" || item.role !== "");
}

export function parseProjects(raw: unknown): ProjectItem[] {
  return asArray(raw)
    .filter(isObject)
    .map((item) => ({
      title: str(item.title),
      description: str(item.description),
      stack: strArray(item.stack),
      url: typeof item.url === "string" ? item.url : undefined,
    }))
    .filter((item) => item.title !== "");
}

/* ===== 자동 데이터 ===== */

function parseRepo(raw: unknown): GithubRepo | null {
  if (!isObject(raw)) return null;
  const name = str(raw.name);
  if (name === "") return null;
  return {
    name,
    description: str(raw.description),
    stars: num(raw.stars),
    language: typeof raw.language === "string" ? raw.language : null,
    url: str(raw.url),
    updatedAt: str(raw.updatedAt),
  };
}

function parseLanguageStat(raw: unknown): LanguageStat | null {
  if (!isObject(raw)) return null;
  const name = str(raw.name);
  if (name === "") return null;
  return { name, count: num(raw.count) };
}

export function parseGithub(raw: unknown): GithubData {
  if (!isObject(raw)) return EMPTY_GITHUB;
  return {
    username: str(raw.username),
    repoCount: num(raw.repoCount),
    starCount: num(raw.starCount),
    languages: asArray(raw.languages)
      .map(parseLanguageStat)
      .filter((x): x is LanguageStat => x !== null),
    recentRepos: asArray(raw.recentRepos)
      .map(parseRepo)
      .filter((x): x is GithubRepo => x !== null),
    fetchedAt: str(raw.fetchedAt),
  };
}

function parseBadge(raw: unknown): CredlyBadge | null {
  if (!isObject(raw)) return null;
  const name = str(raw.name);
  if (name === "") return null;
  return {
    id: str(raw.id),
    name,
    issuer: str(raw.issuer),
    skills: strArray(raw.skills),
    imageUrl: str(raw.imageUrl),
    url: str(raw.url),
    issuedAt: str(raw.issuedAt),
  };
}

export function parseCredly(raw: unknown): CredlyData {
  if (!isObject(raw)) return EMPTY_CREDLY;
  return {
    badges: asArray(raw.badges)
      .map(parseBadge)
      .filter((x): x is CredlyBadge => x !== null),
    fetchedAt: str(raw.fetchedAt),
  };
}

function parsePost(raw: unknown): BlogPost | null {
  if (!isObject(raw)) return null;
  const title = str(raw.title);
  if (title === "") return null;
  return {
    title,
    url: str(raw.url),
    publishedAt: str(raw.publishedAt),
  };
}

export function parseBlog(raw: unknown): BlogData {
  if (!isObject(raw)) return EMPTY_BLOG;
  return {
    posts: asArray(raw.posts)
      .map(parsePost)
      .filter((x): x is BlogPost => x !== null),
    fetchedAt: str(raw.fetchedAt),
  };
}
