# board_vue3

Vue 3 + shadcn-vue 기반 게시판 프론트엔드 프로젝트입니다.  
`board_spring-boot` (Spring Boot + JWT + RBAC) 백엔드와 연동합니다.

---

## 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | Vue 3.5 (Composition API, `<script setup>`) |
| 빌드 도구 | Vite 8 |
| UI 컴포넌트 | shadcn-vue (new-york, zinc) |
| CSS | Tailwind CSS v4 + tw-animate-css |
| 상태 관리 | Pinia + pinia-plugin-persistedstate |
| 라우터 | Vue Router 4 |
| HTTP 클라이언트 | Axios |
| 폼 검증 | vee-validate + @vee-validate/zod + Zod |
| 테이블 | @tanstack/vue-table |
| 알림 | vue-sonner |
| 아이콘 | lucide-vue-next |
| 유틸리티 | @vueuse/core, reka-ui, vaul-vue, date-fns |

---

## 사전 요구사항

- Node.js 18 이상
- `board_spring-boot` 서버 실행 중 (`http://localhost:8080`)
- Redis 실행 중 (토큰 갱신용)

---

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview
```

---

## 프로젝트 구조

```
src/
├── App.vue                     # 루트 컴포넌트 (Toaster 포함)
├── main.js                     # 앱 초기화 (Pinia, Router, CSS)
├── style.css                   # 전역 CSS (Tailwind, CSS 변수, 다크모드)
│
├── assets/                     # 정적 파일
│
├── components/
│   ├── DataTable.vue           # @tanstack/vue-table 기반 범용 테이블
│   ├── PageHeader.vue          # 브레드크럼 + 페이지 제목
│   ├── Pagination.vue          # 페이지네이션 UI
│   └── ui/                     # shadcn-vue 컴포넌트 (자동 생성)
│
├── composables/
│   ├── useAxios.js             # Axios 인스턴스 + 토큰 갱신 인터셉터
│   ├── usePagination.js        # 페이지/사이즈 상태 관리
│   └── useSorting.js           # 정렬 컬럼/방향 상태 관리
│
├── layouts/
│   ├── Nav.vue                 # 상단 네비게이션 (동적 메뉴 + 프로필)
│   ├── PrivateLayout.vue       # 인증 필요 레이아웃 (메뉴 접근 권한 검증)
│   └── PublicLayout.vue        # 비인증 레이아웃 (로그인/회원가입)
│
├── pages/
│   ├── auth/
│   │   ├── SignIn.vue          # 로그인
│   │   └── SignUp.vue          # 회원가입
│   ├── dashboard/
│   │   └── Dashboard.vue       # 대시보드
│   ├── post/
│   │   ├── PostList.vue        # 게시글 목록 (검색, 페이징, 정렬)
│   │   ├── PostCreate.vue      # 게시글 작성
│   │   ├── PostDetail.vue      # 게시글 상세 + 댓글
│   │   ├── PostEdit.vue        # 게시글 수정
│   │   ├── CommentCreate.vue   # 댓글/대댓글 작성
│   │   ├── CommentList.vue     # 댓글 목록
│   │   └── CommentItem.vue     # 댓글 항목 (대댓글 포함)
│   ├── admin/
│   │   ├── user/
│   │   │   ├── UserList.vue    # 사용자 목록 + 검색
│   │   │   ├── UserCreate.vue  # 사용자 생성
│   │   │   ├── UserDetail.vue  # 사용자 상세
│   │   │   └── UserEdit.vue    # 사용자 수정
│   │   ├── menu/
│   │   │   ├── MenuList.vue    # 메뉴 트리 CRUD
│   │   │   └── MenuTreeNode.vue # 재귀 트리 노드 컴포넌트
│   │   └── role/
│   │       ├── Role.vue        # 권한관리 탭 (목록/메뉴/사용자)
│   │       ├── RoleList.vue    # 권한 목록
│   │       ├── RoleModal.vue   # 권한 등록/수정 모달
│   │       ├── MenuRole.vue    # 권한별 메뉴 설정 (체크박스 트리)
│   │       ├── MenuCheckTree.vue # 재귀 체크박스 트리 (indeterminate 지원)
│   │       └── UserRole.vue    # 권한별 사용자 설정 (좌우 이동)
│   ├── user/
│   │   └── Profile.vue         # 프로필 수정
│   └── common/
│       └── NotFound.vue        # 404 페이지
│
├── router/
│   ├── index.js                # 라우트 정의 + 네비게이션 가드
│   └── allowUrl.js             # 인증 없이 접근 가능한 URL 목록
│
├── store/
│   ├── useAuthStore.js         # 인증 상태 (user, isAuthenticated) + persist
│   └── useMenuStore.js         # 메뉴 목록 상태 + persist
│
└── lib/
    └── utils.js                # cn() 유틸리티 (clsx + tailwind-merge)
```

---

## 주요 기능

### 인증
- HttpOnly 쿠키 기반 JWT 인증 (Bearer Token 없음)
- Access Token 만료 시 자동 갱신 (`/api/auth/reissue`) 후 원래 요청 재시도
- 갱신 실패 시 자동 로그아웃 + 로그인 페이지 이동

### 메뉴 (RBAC)
- 로그인 후 사용자 권한에 맞는 메뉴 목록 서버에서 조회
- 상단 Nav에 동적으로 렌더링 (부모 메뉴 hover 시 자식 메뉴 드롭다운)
- `PrivateLayout`에서 현재 경로가 허용된 메뉴 URL인지 검증

### 게시판
- 카테고리(categoryId) 기반 다중 게시판
- 제목 / 작성자 검색, 컬럼 정렬, 서버 사이드 페이징
- 댓글 및 대댓글 작성/삭제

### 관리자
- **사용자 관리**: 목록 조회/생성/수정/상세
- **메뉴 관리**: 트리 구조 메뉴 CRUD (클릭 선택)
- **권한 관리**:
  - 권한별 메뉴 설정: 재귀 체크박스 트리 (부모 클릭 시 자식 일괄 선택, indeterminate 상태 지원)
  - 권한별 사용자 설정: 좌(전체) ↔ 우(권한 보유) 이동, 클라이언트 측 `roleUserIds` Set으로 동기화

---

## 환경 설정

### Vite 프록시 (`vite.config.js`)

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

`/api/*` 요청을 Spring Boot 서버로 전달합니다. `/api` 경로를 그대로 유지합니다.

### 경로 별칭

`@/` → `src/` 로 매핑됩니다 (`jsconfig.app.json` + `vite.config.js`).

---

## 백엔드 연동 API

| 분류 | 메서드 | 경로 |
|---|---|---|
| 인증 | POST | `/api/auth/signIn` |
| 인증 | POST | `/api/auth/signUp` |
| 인증 | POST | `/api/auth/signOut` |
| 인증 | POST | `/api/auth/reissue` |
| 공통 | GET | `/api/common/menus/{userId}` |
| 게시글 | GET / POST | `/api/boards/{categoryId}/posts` |
| 게시글 | GET / PUT / DELETE | `/api/boards/{categoryId}/posts/{postId}` |
| 댓글 | GET / POST | `/api/boards/{categoryId}/posts/{postId}/comments` |
| 사용자 관리 | GET / POST / PUT | `/api/admin/users` |
| 메뉴 관리 | GET / POST / PUT / DELETE | `/api/admin/menus` |
| 권한 관리 | GET / POST / PUT / DELETE | `/api/admin/roles` |
| 권한-메뉴 | GET / POST | `/api/admin/menuRole/{roleId}` |
| 권한-사용자 | GET / POST | `/api/admin/userRole/{roleId}` |

---

## 라우트 구조

```
/                             → /dashboard (리다이렉트)
/dashboard                    대시보드
/user/profile                 프로필

/boards/:categoryId/posts                   게시글 목록
/boards/:categoryId/posts/create            게시글 작성
/boards/:categoryId/posts/:postId           게시글 상세
/boards/:categoryId/posts/:postId/edit      게시글 수정

/admin/users                  사용자 목록
/admin/users/create           사용자 생성
/admin/users/:userId          사용자 상세
/admin/users/:userId/edit     사용자 수정
/admin/menus                  메뉴 관리
/admin/roles                  권한 관리

/auth/signIn                  로그인
/auth/signUp                  회원가입
```

**네비게이션 가드**
- 비인증 상태에서 보호된 경로 접근 → `/auth/signIn` 이동
- 인증 상태에서 `/auth/*` 접근 → `/dashboard` 이동
