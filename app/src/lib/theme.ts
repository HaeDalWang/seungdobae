import { applyMode, Mode } from "@cloudscape-design/global-styles";

const STORAGE_KEY = "color-mode";

export type ColorMode = "light" | "dark";

function toCloudscapeMode(mode: ColorMode): Mode {
  return mode === "dark" ? Mode.Dark : Mode.Light;
}

/** 저장된 설정 → OS 선호 → light 순으로 초기 모드를 결정한다. */
export function getInitialMode(): ColorMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  const prefersDark =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

/** Cloudscape 전역 모드를 적용하고 사용자 선택을 저장한다. */
export function applyColorMode(mode: ColorMode): void {
  applyMode(toCloudscapeMode(mode));
  localStorage.setItem(STORAGE_KEY, mode);
}
