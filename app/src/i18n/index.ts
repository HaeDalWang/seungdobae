import { ko, type Strings } from "./ko";

// 현재는 한국어 단일 로케일. en.ts 추가 시 locale 분기만 확장하면 된다.
const strings: Strings = ko;

/** UI 문자열 번들을 반환한다. 컴포넌트에서 `const t = useStrings()` 형태로 사용. */
export function useStrings(): Strings {
  return strings;
}

export type { Strings };
