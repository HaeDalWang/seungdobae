/**
 * 사이트 데이터 모델.
 *
 * - 수동 데이터(profile/experience/projects): 사람이 사실만 채운다.
 * - 자동 데이터(github/credly/blog): CI가 빌드 시점에 수집해 덮어쓴다.
 *
 * 모든 타입은 수집 스크립트의 출력과 뷰의 소비 형태를 동시에 규정한다.
 */

/* ===== 수동 데이터 ===== */

export interface ContactInfo {
  email?: string;
  github?: string;
  linkedin?: string;
  location?: string;
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  /** 경력 연차 자동 계산 기준일 (YYYY-MM-DD). */
  careerStartDate: string;
  contact: ContactInfo;
}

export interface ExperienceItem {
  company: string;
  role: string;
  /** YYYY-MM 또는 YYYY-MM-DD. */
  startDate: string;
  /** 진행 중이면 null. */
  endDate: string | null;
  /** 성과/업무 요약 bullet. */
  highlights: string[];
}

export interface ProjectItem {
  title: string;
  description: string;
  stack: string[];
  /** 외부 링크 (레포/데모 등). 없으면 생략. */
  url?: string;
}

/* ===== 자동 데이터 ===== */

export interface GithubRepo {
  name: string;
  description: string;
  stars: number;
  language: string | null;
  url: string;
  /** ISO 8601. */
  updatedAt: string;
}

export interface LanguageStat {
  name: string;
  /** 해당 언어를 주 언어로 쓰는 저장소 수. */
  count: number;
}

export interface GithubData {
  username: string;
  repoCount: number;
  starCount: number;
  languages: LanguageStat[];
  recentRepos: GithubRepo[];
  /** 수집 시각 ISO 8601. */
  fetchedAt: string;
}

export interface CredlyBadge {
  id: string;
  name: string;
  issuer: string;
  skills: string[];
  imageUrl: string;
  url: string;
  /** YYYY-MM-DD. */
  issuedAt: string;
}

export interface CredlyData {
  badges: CredlyBadge[];
  fetchedAt: string;
}

export interface BlogPost {
  title: string;
  url: string;
  /** ISO 8601. */
  publishedAt: string;
}

export interface BlogData {
  posts: BlogPost[];
  fetchedAt: string;
}

/* ===== 빈 상태 fallback ===== */
/** fetch 실패·데이터 부재 시 UI가 깨지지 않도록 안전한 기본값을 제공한다. */

export const EMPTY_PROFILE: Profile = {
  name: "",
  title: "",
  bio: "",
  careerStartDate: "",
  contact: {},
};

export const EMPTY_GITHUB: GithubData = {
  username: "",
  repoCount: 0,
  starCount: 0,
  languages: [],
  recentRepos: [],
  fetchedAt: "",
};

export const EMPTY_CREDLY: CredlyData = {
  badges: [],
  fetchedAt: "",
};

export const EMPTY_BLOG: BlogData = {
  posts: [],
  fetchedAt: "",
};
