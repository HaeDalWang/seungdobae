// GitHub 공개 활동 수집 → public/data/github.json
//
// 사용법: node scripts/fetch-github.mjs <username>
//   또는: GITHUB_USERNAME=<username> node scripts/fetch-github.mjs
// 선택: GITHUB_TOKEN 환경변수가 있으면 rate limit 상향 (CI 내장 토큰 사용).
//
// 실패해도 빌드를 막지 않는다: 기존 github.json을 보존하고 경고만 남긴다.
import { resolveUsername, writeJson, fetchJson, nowIso } from "./lib.mjs";

const MAX_RECENT_REPOS = 6;
const PER_PAGE = 100;
const TOP_LANGUAGES = 8;

function authHeaders() {
  const token = process.env.GITHUB_TOKEN;
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "seungdobae-site-fetcher",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/** 사용자의 모든 공개 저장소를 페이지네이션으로 수집한다. */
async function fetchAllRepos(username, headers) {
  const repos = [];
  for (let page = 1; ; page += 1) {
    const url =
      `https://api.github.com/users/${encodeURIComponent(username)}/repos` +
      `?per_page=${PER_PAGE}&page=${page}&sort=updated&type=owner`;
    const batch = await fetchJson(url, headers);
    if (!Array.isArray(batch) || batch.length === 0) break;
    repos.push(...batch);
    if (batch.length < PER_PAGE) break;
  }
  return repos;
}

/** fork·아카이브를 제외한 원본 공개 저장소만 남긴다. */
function ownRepos(repos) {
  return repos.filter((r) => !r.fork && !r.archived && r.private !== true);
}

function buildLanguageStats(repos) {
  const counts = new Map();
  for (const r of repos) {
    if (!r.language) continue;
    counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP_LANGUAGES);
}

function buildRecentRepos(repos) {
  return [...repos]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, MAX_RECENT_REPOS)
    .map((r) => ({
      name: r.name,
      description: r.description ?? "",
      stars: r.stargazers_count ?? 0,
      language: r.language ?? null,
      url: r.html_url,
      updatedAt: r.updated_at,
    }));
}

async function main() {
  const username = resolveUsername("GITHUB_USERNAME");
  if (!username) {
    console.error("[fetch-github] 사용자명이 필요합니다. 인자 또는 GITHUB_USERNAME 환경변수로 전달하세요.");
    process.exit(1);
  }

  const headers = authHeaders();
  const all = await fetchAllRepos(username, headers);
  const repos = ownRepos(all);

  const data = {
    username,
    repoCount: repos.length,
    starCount: repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0),
    languages: buildLanguageStats(repos),
    recentRepos: buildRecentRepos(repos),
    fetchedAt: nowIso(),
  };

  const path = await writeJson("github.json", data);
  console.log(
    `[fetch-github] ${username}: 저장소 ${data.repoCount}개, Star ${data.starCount}개 → ${path}`
  );
}

main().catch((err) => {
  // 빌드 파이프라인을 막지 않도록 경고만 남기고 기존 데이터를 보존한다.
  console.error("[fetch-github] 수집 실패 (기존 github.json 유지):", err.message);
  process.exit(0);
});
