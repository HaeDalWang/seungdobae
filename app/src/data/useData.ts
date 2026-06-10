import { useEffect, useState } from "react";

/** 데이터 로드 상태. 로딩/에러를 UI에 명시적으로 노출한다. */
export interface DataState<T> {
  data: T;
  loading: boolean;
  /** fetch/파싱 실패 메시지. 성공 시 null. */
  error: string | null;
}

/**
 * public/data/<file>을 fetch해 파서로 검증한 결과를 반환한다.
 *
 * 실패 시 fallback(빈 상태)을 데이터로 유지하되 error를 채워
 * UI가 깨지지 않으면서도 실패를 숨기지 않는다 (룰: 에러 미삼킴).
 *
 * @param file public/data 기준 파일명 (예: "profile.json")
 * @param parse 외부 입력을 검증·정규화하는 함수
 * @param fallback 파싱 실패 시 사용할 안전한 기본값
 */
export function useData<T>(
  file: string,
  parse: (raw: unknown) => T,
  fallback: T
): DataState<T> {
  const [state, setState] = useState<DataState<T>>({
    data: fallback,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // BASE_URL을 붙여 서브패스 배포에서도 안전하게 해석한다.
        const url = `${import.meta.env.BASE_URL}data/${file}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} (${file})`);
        }
        const raw: unknown = await res.json();
        const data = parse(raw);
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        // 콘솔에 상세 컨텍스트를 남기고, UI에는 안전한 fallback을 보여준다.
        console.error(`[useData] ${file} 로드 실패:`, message);
        if (!cancelled) {
          setState({ data: fallback, loading: false, error: message });
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [file, parse, fallback]);

  return state;
}
