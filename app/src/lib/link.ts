/** 프로젝트 링크의 성격(저장소 vs 외부 기사)을 판별한다. */

/** url이 GitHub 저장소 링크인지 판별한다. 무효/빈 값은 false. */
export function isGithubUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === "github.com" || host.endsWith(".github.com");
  } catch {
    return false;
  }
}
