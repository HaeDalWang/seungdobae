// 로컬 환경에서 운영 지표(숫자)만 집계해 profile.json의 metrics를 갱신한다.
//
// 사용법: node scripts/local-metrics.mjs          # 계산 결과와 diff만 출력 (드라이런)
//         node scripts/local-metrics.mjs --write  # profile.json에 반영
//
// 로컬 전용이다. CI에서는 실행하지 않는다 (kubeconfig·Zendesk 토큰이 없어야 정상).
// 출력과 파일에는 숫자만 남긴다. context 이름·고객사·티켓 내용은 어디에도 쓰지 않는다.
import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dataDir, fetchJson } from "./lib.mjs";

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

async function countTickets() {
  const conf = parseConf(await readFile(ZENDESK_CONF, "utf8"));
  const { ZENDESK_SUBDOMAIN: sub, ZENDESK_EMAIL: email, ZENDESK_API_TOKEN: token } = conf;
  if (!sub || !email || !token) throw new Error("zendesk.conf에 자격증명이 없습니다");
  const host = sub.endsWith(".zendesk.com") ? sub : `${sub}.zendesk.com`;
  const auth = "Basic " + Buffer.from(`${email}/token:${token}`).toString("base64");
  const query = encodeURIComponent(`type:ticket assignee:${email}`);
  const res = await fetchJson(`https://${host}/api/v2/search.json?query=${query}&per_page=1`, {
    Authorization: auth,
  });
  if (!Number.isInteger(res.count)) throw new Error("Zendesk 응답에 count가 없습니다");
  return res.count;
}

async function main() {
  const shouldWrite = process.argv.includes("--write");
  const kube = JSON.parse(execFileSync("kubectl", ["config", "view", "-o", "json"]));
  const next = { clusters: countClusters(kube), tickets: await countTickets() };

  const path = resolve(dataDir(), "profile.json");
  const profile = JSON.parse(await readFile(path, "utf8"));
  const prev = profile.metrics ?? {};
  for (const key of Object.keys(next)) {
    console.log(`${key}: ${prev[key] ?? "-"} → ${next[key]}`);
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
