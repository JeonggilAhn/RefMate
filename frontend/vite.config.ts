import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    svgr({
      svgrOptions: {
        icon: true, // ✅ 아이콘 최적화
        // dimensions: false, // ✅ 기본 width/height 제거
      },
    }),
  ],
  build: {
    outDir: 'dist',
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  server: {
    port: 3000, // port
    watch: {
      usePolling: true, // 파일 변경 감지 강제 활성화
    },
    strictPort: true, // 포트 충돌 방지
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ✅ '@'를 src 폴더로 매핑
    },
  },
  define: {
    global: 'window',
  },
});
