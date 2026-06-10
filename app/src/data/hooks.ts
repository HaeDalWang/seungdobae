/**
 * 데이터 타입별 편의 훅. 파서·fallback을 고정해 뷰에서 한 줄로 쓴다.
 * 파서/fallback은 모듈 레벨 상수라 useData의 의존성으로도 안정적이다.
 */
import { useData, type DataState } from "./useData";
import {
  parseProfile,
  parseExperience,
  parseProjects,
  parseGithub,
  parseCredly,
  parseBlog,
} from "./validate";
import {
  type Profile,
  type ExperienceItem,
  type ProjectItem,
  type GithubData,
  type CredlyData,
  type BlogData,
  EMPTY_PROFILE,
  EMPTY_GITHUB,
  EMPTY_CREDLY,
  EMPTY_BLOG,
} from "./types";

export function useProfile(): DataState<Profile> {
  return useData("profile.json", parseProfile, EMPTY_PROFILE);
}

export function useExperience(): DataState<ExperienceItem[]> {
  return useData("experience.json", parseExperience, EMPTY_EXPERIENCE);
}

export function useProjects(): DataState<ProjectItem[]> {
  return useData("projects.json", parseProjects, EMPTY_PROJECTS);
}

export function useGithub(): DataState<GithubData> {
  return useData("github.json", parseGithub, EMPTY_GITHUB);
}

export function useCredly(): DataState<CredlyData> {
  return useData("credly.json", parseCredly, EMPTY_CREDLY);
}

export function useBlog(): DataState<BlogData> {
  return useData("blog.json", parseBlog, EMPTY_BLOG);
}

// 배열 fallback은 매 렌더 새 배열이 생기지 않도록 모듈 레벨에 고정한다.
const EMPTY_EXPERIENCE: ExperienceItem[] = [];
const EMPTY_PROJECTS: ProjectItem[] = [];
