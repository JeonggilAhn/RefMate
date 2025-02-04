export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // ✅ src 폴더의 모든 JS/TS/JSX/TSX 파일을 감지
    './node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}', // ✅ shadcn/ui 컴포넌트 감지
  ],
  theme: {},
  plugins: [],
};
