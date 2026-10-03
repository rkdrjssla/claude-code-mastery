# bucket-list-main: CLAUDE.md

바닐라 JavaScript 버킷리스트 앱. 빌드 도구 없음, Tailwind CDN, LocalStorage 영속성.

## 아키텍처 불변성

**모든 데이터 변경은 `js/storage.js`의 `BucketStorage` 객체를 경유해야 함.** UI가 localStorage나 메모리를 직접 수정하면 안 됨.

흐름: `BucketListApp` 이벤트 핸들러 → `BucketStorage.addItem()/updateItem()/deleteItem()/toggleComplete()` → `render()` 호출

## HTML 로드 순서

`index.html`의 `<script>` 순서 필수:
1. Tailwind CDN (`<head>`)
2. `js/storage.js` (데이터 계층)
3. `js/app.js` (UI 계층, 마지막 줄에서 `new BucketListApp().init()`)

## 핵심 규칙

- **XSS 보안**: 사용자 입력을 HTML 문자열에 넣을 때 `escapeHtml()` 호출 필수 (이미 `createBucketItemHTML()`에서 구현됨).
- **데이터 스키마**: `localStorage['bucketList']` = JSON 배열. 각 항목 5필드: `id`(timestamp 문자열), `title`, `completed`(bool), `createdAt`, `completedAt`(ISO 문자열 또는 null).
- **상태 관리**: `editingId`(모달), `currentFilter`(필터 버튼, 미영속). 모두 `BucketListApp` 인스턴스 변수.

## 테스트

테스트 프레임워크 없음 → 브라우저 수동 확인:
1. 항목 추가/편집/삭제/완료 토글
2. 필터(all/active/completed)
3. 새로고침 → 데이터 영속성 확인
4. 320px 폭에서 반응형 확인

## 파일 참고

- `js/counter.js`: 별도 학습 파일, 버킷리스트와 무관.
