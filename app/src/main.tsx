import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@cloudscape-design/global-styles/index.css";
import { applyBrandTheme, applyColorMode, getInitialMode } from "./lib/theme";
import App from "./App";

// 첫 페인트 전에 색상 모드·테마를 적용해 깜빡임(FOUC)을 막는다.
applyColorMode(getInitialMode());
applyBrandTheme();

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
