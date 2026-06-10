// vitest + jsdom 공통 셋업.
// Cloudscape/매치미디어 등 jsdom 미구현 API의 최소 폴리필을 둔다.

if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  // jsdom에는 matchMedia가 없어 theme 초기화가 깨지므로 stub.
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
