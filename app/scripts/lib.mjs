// 수집 스크립트 공통 유틸 (Node ESM, 빌드 타임 전용).
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** public/data 디렉터리의 절대 경로를 반환한다. */
export function dataDir() {
  return resolve(__dirname, "..", "public", "data");
}

/** 인자 또는 환경변수에서 사용자명을 해석한다. 없으면 null. */
export function resolveUsername(envKey) {
  const fromArg = process.argv[2];
  const fromEnv = process.env[envKey];
  const value = (fromArg || fromEnv || "").trim();
  return value === "" ? null : value;
}

/** JSON을 들여쓰기 2칸 + 개행으로 파일에 쓴다. */
export async function writeJson(filename, obj) {
  const dir = dataDir();
  await mkdir(dir, { recursive: true });
  const path = resolve(dir, filename);
  await writeFile(path, JSON.stringify(obj, null, 2) + "\n", "utf8");
  return path;
}

/** fetch 후 JSON 파싱. 비정상 상태코드는 에러로 던진다. */
export async function fetchJson(url, headers = {}) {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${url}`);
  }
  return res.json();
}

/** 현재 시각 ISO 8601. */
export function nowIso() {
  return new Date().toISOString();
}
