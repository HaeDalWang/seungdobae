import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 정적 SPA 빌드. S3+CloudFront 배포 대상.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
    // Cloudscape는 번들이 크므로 청크 경고 한도를 현실적으로 상향
    chunkSizeWarningLimit: 1200,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    // playwright e2e는 vitest 수집 대상에서 제외
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**"],
  },
});
