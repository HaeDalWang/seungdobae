// Credly 공개 자격증 배지 수집 → public/data/credly.json
//
// 사용법: node scripts/fetch-credly.mjs <username>
//   또는: CREDLY_USERNAME=<username> node scripts/fetch-credly.mjs
//
// 비공식 공개 엔드포인트(badges.json)를 사용한다. 인증 불필요.
// 빌드 타임 실행이므로 브라우저 CORS 제약과 무관하다.
// 실패해도 빌드를 막지 않는다: 기존 credly.json을 보존하고 경고만 남긴다.
import { resolveUsername, writeJson, fetchJson, nowIso } from "./lib.mjs";

/** issuer.entities에서 발급기관명을 추출한다. (검증된 매핑) */
function extractIssuer(badge) {
  const entities = badge?.issuer?.entities;
  if (!Array.isArray(entities)) return "";
  return entities
    .map((e) => e?.entity?.name)
    .filter((name) => typeof name === "string" && name !== "")
    .join(", ");
}

/** badge_template.skills에서 스킬명 배열을 추출한다. */
function extractSkills(badge) {
  const skills = badge?.badge_template?.skills;
  if (!Array.isArray(skills)) return [];
  return skills
    .map((s) => s?.name)
    .filter((name) => typeof name === "string" && name !== "");
}

/** Credly 원본 배지 항목을 우리 CredlyBadge 형태로 정규화한다. */
function normalizeBadge(badge) {
  const template = badge?.badge_template ?? {};
  return {
    id: typeof badge?.id === "string" ? badge.id : "",
    name: typeof template.name === "string" ? template.name : "",
    issuer: extractIssuer(badge),
    skills: extractSkills(badge),
    imageUrl:
      typeof badge?.image_url === "string"
        ? badge.image_url
        : typeof template.image_url === "string"
          ? template.image_url
          : "",
    url:
      typeof badge?.id === "string"
        ? `https://www.credly.com/badges/${badge.id}/public_url`
        : "",
    issuedAt: typeof badge?.issued_at_date === "string" ? badge.issued_at_date : "",
  };
}

async function main() {
  const username = resolveUsername("CREDLY_USERNAME");
  if (!username) {
    console.error("[fetch-credly] 사용자명이 필요합니다. 인자 또는 CREDLY_USERNAME 환경변수로 전달하세요.");
    process.exit(1);
  }

  const url = `https://www.credly.com/users/${encodeURIComponent(username)}/badges.json`;
  const raw = await fetchJson(url, { "User-Agent": "seungdobae-site-fetcher" });

  const list = Array.isArray(raw?.data) ? raw.data : [];
  const badges = list
    .map(normalizeBadge)
    .filter((b) => b.name !== "")
    // 최신 취득순 정렬
    .sort((a, b) => (a.issuedAt < b.issuedAt ? 1 : a.issuedAt > b.issuedAt ? -1 : 0));

  const data = { badges, fetchedAt: nowIso() };
  const path = await writeJson("credly.json", data);
  console.log(`[fetch-credly] ${username}: 배지 ${badges.length}개 → ${path}`);
}

main().catch((err) => {
  console.error("[fetch-credly] 수집 실패 (기존 credly.json 유지):", err.message);
  process.exit(0);
});
