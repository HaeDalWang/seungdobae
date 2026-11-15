import { applyMode, Mode } from "@cloudscape-design/global-styles";
import { applyTheme } from "@cloudscape-design/components/theming";

const STORAGE_KEY = "color-mode";

/** 포인트 색. 콘솔 주황 계열 — 차트와 히어로 배너가 같은 색을 공유한다. */
const ACCENT = { light: "#ec7211", dark: "#ff9900" };

/** 개요 히어로 배너 배경. 라이트·다크 모두 짙은 남색 위에 포인트 색 빛을 얹는다. */
export const HERO_BACKGROUND =
  "radial-gradient(circle at 85% 15%, rgba(255, 153, 0, 0.22), transparent 45%), " +
  "linear-gradient(135deg, #0f141a 0%, #15263b 55%, #1d3d63 100%)";

/** Cloudscape 공식 테마 API로 포인트 색을 적용한다. 앱 시작 시 한 번 호출. */
export function applyBrandTheme(): void {
  applyTheme({ theme: { tokens: { colorChartsPaletteCategorical1: ACCENT } } });
}

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
