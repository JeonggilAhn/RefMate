export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // ✅ src 폴더의 모든 JS/TS/JSX/TSX 파일을 감지
  ],
  theme: {
    extend: {},
  },
  plugins: [require('tailwindcss-animate')],
};
