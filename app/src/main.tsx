import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@cloudscape-design/global-styles/index.css";
// Cloudscape 전역 스타일 뒤에 얹어야 핸드오프 토큰·폰트가 우선한다.
import "./styles/fonts";
import "./styles/global.css";
import { applyColorMode, getInitialMode } from "./lib/theme";
import App from "./App";

// 첫 페인트 전에 색상 모드를 적용해 깜빡임(FOUC)을 막는다.
applyColorMode(getInitialMode());

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("루트 엘리먼트(#root)를 찾을 수 없습니다.");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
