// 로컬 환경에서 운영 지표(숫자)만 집계해 profile.json의 metrics를 갱신한다.
//
// 사용법: node scripts/local-metrics.mjs          # 계산 결과와 diff만 출력 (드라이런)
//         node scripts/local-metrics.mjs --write  # profile.json에 반영
//
// 로컬 전용이다. CI에서는 실행하지 않는다 (kubeconfig·Zendesk 토큰이 없어야 정상).
// 출력과 파일에는 숫자만 남긴다. context 이름·고객사·티켓 내용은 어디에도 쓰지 않는다.
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dataDir, fetchJson } from "./lib.mjs";
import { mergeByProduct, resourceArea, topWithOther } from "./tech-map.mjs";

const ZENDESK_CONF = resolve(homedir(), ".config/saltware/zendesk.conf");
/** 운영 대상이 아닌 context/서버 (PoC·로컬). 고객 식별자는 넣지 않는다. */
const EXCLUDE = /poc|kind|minikube|docker-desktop|localhost|127\.0\.0\.1/i;

/** `kubectl config view -o json` 결과에서 운영 클러스터 수(서버 endpoint 중복 제거)를 센다. */
export function countClusters(kubeConfig) {
  const servers = new Map(
    (kubeConfig.clusters ?? []).map((c) => [c.name, c.cluster?.server ?? ""])
  );
  const unique = new Set();
  for (const ctx of kubeConfig.contexts ?? []) {
    const server = servers.get(ctx.context?.cluster) ?? "";
    if (server === "" || EXCLUDE.test(ctx.name) || EXCLUDE.test(server)) continue;
    unique.add(server);
  }
  return unique.size;
}

const IAC_ROOT = resolve(homedir(), "salt");
const IAC_SKIP_DIRS = new Set([".git", ".terraform", ".terragrunt-cache", "node_modules"]);
const CAREER_START_YEAR = 2022; // profile.json의 careerStartDate 연도
const HELM_TOP = 25;
const AREA_TOP = 20;
/** 다음 최상위 블록 시작 전까지를 한 블록으로 본다. */
const NEXT_BLOCK = /\n(?:resource|module|data|locals|variable|output|provider)\s/;

/**
 * root 아래 Terraform 코드 규모를 숫자로만 집계한다. 파일명·리소스명·내용은 남기지 않는다.
 * "정의" 개수다 (환경별로 복제된 코드는 각각 센다). 없는 디렉토리는 0.
 * helm/areas는 tech-map으로 정리한 공개 제품·서비스 이름과 개수만 담는다 (모르는 이름은 "기타").
 */
export function scanIac(root) {
  const total = { terraformLines: 0, resources: 0, modules: 0, helmReleases: 0 };
  const charts = new Map();
  const areas = new Map();
  const bump = (map, key) => map.set(key, (map.get(key) ?? 0) + 1);
  const walk = (dir) => {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.isDirectory()) {
        if (!IAC_SKIP_DIRS.has(e.name)) walk(join(dir, e.name));
      } else if (e.name.endsWith(".tf")) {
        const text = readFileSync(join(dir, e.name), "utf8");
        total.terraformLines += text.split("\n").length - (text.endsWith("\n") ? 1 : 0);
        total.modules += (text.match(/^\s*module\s+"/gm) ?? []).length;
        for (const m of text.matchAll(/^\s*resource\s+"([a-z0-9_]+)"/gm)) {
          total.resources += 1;
          bump(areas, resourceArea(m[1]));
          if (m[1] !== "helm_release") continue;
          total.helmReleases += 1;
          const rest = text.slice(m.index + m[0].length);
          const end = rest.search(NEXT_BLOCK);
          const chart = /^\s*chart\s*=\s*"([^"]+)"/m.exec(end < 0 ? rest : rest.slice(0, end))?.[1] ?? "";
          bump(charts, chart);
        }
      }
    }
  };
  walk(root);
  return { ...total, helm: topWithOther(mergeByProduct(charts), HELM_TOP), areas: topWithOther(areas, AREA_TOP) };
}

/** KEY=VALUE 형식 conf 파싱. read_conf(zendesk_weekly.py)와 같은 규칙. */
export function parseConf(text) {
  const conf = {};
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (line === "" || line.startsWith("#") || !line.includes("=")) continue;
    const idx = line.indexOf("=");
    conf[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return conf;
}

/** 연도별 생성일 범위 쿼리. Zendesk 날짜 비교는 `>`·`<`만 쓴다. */
export function buildYearQueries(fromYear, toYear) {
  const years = Array.from({ length: toYear - fromYear + 1 }, (_, i) => fromYear + i);
  return years.map((year) => ({
    year,
    query: `created>${year - 1}-12-31 created<${year + 1}-01-01`,
  }));
}

async function createZendeskCounter() {
  const conf = parseConf(await readFile(ZENDESK_CONF, "utf8"));
  const { ZENDESK_SUBDOMAIN: sub, ZENDESK_EMAIL: email, ZENDESK_API_TOKEN: token } = conf;
  if (!sub || !email || !token) throw new Error("zendesk.conf에 자격증명이 없습니다");
  const host = sub.endsWith(".zendesk.com") ? sub : `${sub}.zendesk.com`;
  const auth = "Basic " + Buffer.from(`${email}/token:${token}`).toString("base64");
  /** 내가 담당자인 티켓 중 extra 조건에 맞는 개수. */
  return async (extra = "") => {
    const query = encodeURIComponent(`type:ticket assignee:${email} ${extra}`.trim());
    const res = await fetchJson(`https://${host}/api/v2/search.json?query=${query}&per_page=1`, {
      Authorization: auth,
    });
    if (!Number.isInteger(res.count)) throw new Error("Zendesk 응답에 count가 없습니다");
    return res.count;
  };
}

async function main() {
  const shouldWrite = process.argv.includes("--write");
  const kube = JSON.parse(execFileSync("kubectl", ["config", "view", "-o", "json"]));
  const countTickets = await createZendeskCounter();
  const tickets = await countTickets();
  const ticketsByYear = [];
  for (const { year, query } of buildYearQueries(CAREER_START_YEAR, new Date().getFullYear())) {
    ticketsByYear.push({ year, count: await countTickets(query) });
  }
  const yearSum = ticketsByYear.reduce((sum, y) => sum + y.count, 0);
  if (yearSum !== tickets) console.warn(`[경고] 연도별 합계 ${yearSum} ≠ 전체 ${tickets} (경력 시작 연도 이전 티켓이 있나 확인)`);
  const next = {
    clusters: countClusters(kube),
    tickets,
    ticketsByYear,
    iac: scanIac(IAC_ROOT),
  };

  const path = resolve(dataDir(), "profile.json");
  const profile = JSON.parse(await readFile(path, "utf8"));
  const prev = profile.metrics ?? {};
  for (const key of Object.keys(next)) {
    console.log(`${key}: ${JSON.stringify(prev[key] ?? "-")} → ${JSON.stringify(next[key])}`);
  }
  if (!shouldWrite) return console.log("(드라이런. 반영하려면 --write)");

  profile.metrics = { ...prev, ...next };
  await writeFile(path, JSON.stringify(profile, null, 2) + "\n", "utf8");
  console.log(`profile.json 갱신 완료 → ${path}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error("[local-metrics] 실패:", err.message);
    process.exit(1);
  });
}
