# 🧩 디자이너-클라이언트 실시간 협업 도구 (1차 프로젝트)

디자이너와 클라이언트 간 원활한 피드백을 지원하는 웹 기반 협업 툴입니다.  
이미지 기반의 UI 상에 핀을 찍고, 위치 기반 메모와 관련 이미지를 등록하며  
Figma와 유사한 형태의 의견 교환을 가능하게 합니다.

## 📌 주요 기능

- 이미지 상의 핀 지정 및 메모/이미지 첨부 기능
- 핀별 노트 목록 및 이미지 리스트 조회
- 무한 스크롤 기반 노트 불러오기
- 노트 검색 기능 및 하이라이팅 이동
- 노트 북마크 기능 및 삭제/수정 기능
- 실시간 UI 반영을 위한 전역 상태 관리 (Recoil)
- 세션 유지 기반 로그인 토큰 관리 (새로고침/창닫기 구분)

---

## ⚙️ 사용 기술 스택

### Frontend
- **React** (컴포넌트 기반 SPA 구현)
- **Recoil** (전역 상태 관리)
- **Tailwind CSS** (유틸리티 기반 스타일링)
- **Styled-components** (일부 커스텀 컴포넌트)
- **TypeScript** (사용 X → JavaScript 기반)
- **Axios** (API 통신)
- **EventSource Polyfill** (SSE 연결 테스트용)

### Backend
- (팀원 담당) Spring Boot, MySQL, JWT 기반 인증/인가 등

---

## 👨‍💻 담당 역할 및 구현 기능

- **핵심 핀/메모 시스템 구현**
  - 핀 클릭 시 메모 목록 및 이미지 동시 노출
  - 메모 클릭 → 상세 뷰 전환 구조 개발
- **무한 스크롤 기반 노트 페이징 구현**
  - Intersection Observer 대신 ScrollTop 계산 방식 사용
  - 스크롤 위치 및 오차 보정을 통한 안정화
- **로그인 유지 세션 관리**
  - 새로고침과 창닫기 구분: `unload`, `beforeunload`, `sessionStorage` 조합
- **컴포넌트 구조 개선**
  - PinContents와 메모 컴포넌트 분리 → z-index 충돌 해결
  - 아이콘 및 UI 공통 컴포넌트 재사용성 향상
- **검색 기능 및 하이라이팅 이동 구현**
  - 검색 시 일치 메모 하이라이팅 및 스크롤 이동

---

## 🛠️ 설치 및 실행 방법

```bash
# 1. 레포 클론
git clone https://github.com/your-id/your-repo-name.git

# 2. 의존성 설치
cd your-repo-name
npm install

# 3. 개발 서버 실행
npm run dev

