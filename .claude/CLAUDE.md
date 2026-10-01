# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**bucket-list-main** is a personal bucket list manager—a vanilla JavaScript web app that lets users track life goals. It uses LocalStorage for data persistence and requires no build tools or backend server.

## Repository Structure

```
claude-code-mastery/
├── workspaces/
│   └── bucket-list-main/          # 메인 프로젝트
│       ├── index.html              # HTML 구조 및 진입점
│       ├── css/
│       │   └── styles.css          # 커스텀 스타일 (Tailwind 보완)
│       ├── js/
│       │   ├── storage.js          # LocalStorage 관리 모듈
│       │   └── app.js              # 메인 애플리케이션 로직 (BucketListApp 클래스)
│       └── README.md               # 프로젝트 문서
└── .claude/                        # Claude Code 설정
    ├── CLAUDE.md                   # 이 파일
    └── settings.local.json         # 로컬 설정
```

## Running the Application

### Option 1: Direct Browser (Quickest)
```bash
# Open index.html directly in your browser
# File → Open File → ./workspaces/bucket-list-main/index.html
# or drag index.html into browser
```

### Option 2: Python HTTP Server
```bash
cd workspaces/bucket-list-main
python -m http.server 8000
# Visit http://localhost:8000
```

### Option 3: Node.js HTTP Server
```bash
cd workspaces/bucket-list-main
npx http-server
# or: npm install -g http-server && http-server
```

### Option 4: VS Code Live Server
Right-click `index.html` → "Open with Live Server"

## Architecture

### Data Layer: `js/storage.js`
Singleton object `BucketStorage` manages all LocalStorage operations:

- **load()**: Read buckets from localStorage
- **save(bucketList)**: Persist array to localStorage  
- **addItem(title)**: Create new bucket with ID (timestamp), createdAt, completedAt fields
- **updateItem(id, newTitle)**: Modify bucket title
- **deleteItem(id)**: Remove bucket
- **toggleComplete(id)**: Mark complete/incomplete and set completedAt
- **getStats()**: Return {total, completed, progress, completionRate}
- **getFilteredList(filter)**: Return buckets filtered by 'all', 'active', 'completed'

All mutations call `save()` automatically; read operations call `load()` to ensure freshness.

### UI Layer: `js/app.js`
`BucketListApp` class manages rendering and user interactions:

- **init()** → cacheElements() → bindEvents() → render()
- **render()** pulls filtered data from BucketStorage, updates stats, regenerates DOM
- Event handlers (handleAdd, handleFilter, handleToggle, handleDelete, handleEditSubmit) mutate storage then call render()
- **createBucketItemHTML(item)** generates item markup; calls **escapeHtml()** for XSS prevention
- Modal state tracked in `editingId`; modal visibility via `hidden`/`flex` class toggle

**Key invariant: All mutations go through BucketStorage. UI never directly modifies data.**

### HTML Structure: `index.html`
- Stats section: four data-bound spans (totalCount, completedCount, progressCount, completionRate)
- Form: bucketForm with bucketInput and submit button
- Filters: three .filter-btn elements with data-filter attribute
- Container: bucketListContainer (empty, filled by render())
- Modal: #editModal with editForm, editInput, cancel/save buttons
- Empty state: #emptyState (hidden until no buckets)

### Styling: `css/styles.css` + Tailwind CDN
- Tailwind provides utility classes via CDN (instantaneous, no build step)
- Custom CSS adds animations (slideIn, fadeIn, scaleIn), filter button states, dark mode
- Mobile breakpoint: max-width 640px adjusts item layout and button sizing

## Data Model

```javascript
{
  id: "1730880000000",           // Date.now().toString()
  title: "Learn Spanish",        // user input, trimmed
  completed: false,              // toggled by checkbox
  createdAt: "2025-11-06T...",  // ISO string on creation
  completedAt: null              // ISO string on completion, null when incomplete
}
```

Stored in `localStorage['bucketList']` as JSON array.

## Common Development Tasks

### Add a new feature
1. If it mutates data: add method to `BucketStorage` (e.g., `addCategory(id, cat)`)
2. If it changes UI: add handler to `BucketListApp` and wire to event listener in bindEvents()
3. Call render() after mutations
4. Test in browser; data persists across refresh

### Debug data
Open browser DevTools Console:
```javascript
BucketStorage.load()          // See all buckets
localStorage.clear()          // Wipe data (start fresh)
```

### Change colors
Edit Tailwind class names in index.html (e.g., bg-blue-600 → bg-purple-600) or add rules to css/styles.css.

### Extend animations
Add @keyframes to css/styles.css and reference in class names.

## Important Notes

### No build step
Keep scripts vanilla JavaScript. If transpilation is needed, add a bundler (Vite, Parcel) later.

### XSS safety
Always call escapeHtml() when inserting user text into HTML strings (done in createBucketItemHTML). This uses textContent to safely escape content.

### LocalStorage limits
~5–10 MB per domain. For 10,000 buckets, ~1 MB used; plenty of headroom.

### Mobile first
Test changes at 320px width; Tailwind's responsive utilities handle larger screens.

### Modal state
editingId tracks which bucket is being edited; null when modal closed.

### Filter state
currentFilter in BucketListApp tracks active filter button; persist to localStorage if needed (not currently done).

## Testing
No test framework installed. Validate manually:
1. Open index.html in browser
2. Add/edit/delete/toggle items
3. Refresh page → data persists
4. Filter by all/active/completed
5. Stats update in real-time
6. Check responsive design at 320px, 768px, 1024px widths

## Future Enhancement Ideas
- Category/tag support
- Image attachments
- Detailed notes per item
- Target completion dates
- Priority levels
- Data export/import (JSON)
- Dark mode toggle
- Drag-and-drop reordering
