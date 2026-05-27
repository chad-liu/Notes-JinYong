# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用指令

```bash
npm run dev      # 開發伺服器（預設 port 3000）
npm run build    # 正式 build（含型別檢查與靜態頁面生成）
npm run lint     # ESLint 檢查
```

Build 成功後再 `git push`；Vercel 透過 GitHub 連動自動部署。

## 專案架構

這是一個 **Next.js 15 App Router** 專案，用於閱讀金庸武俠小說與相關評論書。所有書本內容以靜態 HTML 檔案存放在本機，build 時讀入並靜態化。

### 資料來源（非程式碼）

| 路徑 | 說明 |
|------|------|
| `Books/*.html` | 15 本金庸小說，每檔含 `const chapters = [...]` JS 陣列 |
| `Review/*.html` | 7 本評論書，格式與 Books 相同 |
| `書目.md` | 小說顯示順序，每行 `《書名》` |
| `Review/評論.md` | 評論書顯示順序，每行 `《書名》` |
| `Books/門派.md` | 門派名單，每行一個門派名稱 |

### 核心資料層：`lib/`

- **`lib/slug.ts`**：中文書名 ↔ URL slug 的映射表。小說用 `BOOK_SLUGS`，評論用 `REVIEW_SLUGS`（固定為 `review-1` 到 `review-7`）。新增書目時，兩個 slug map 都要更新。
- **`lib/books.ts`**：讀取、解析、快取書本資料的唯一入口。
  - `parseChaptersFromHtml(filePath)` — 用 regex 從 HTML 萃取 `chapters` JSON 陣列
  - `loadCollection(dir, listFile, slugMap, collection)` — 通用載入函式，小說與評論共用
  - `novelCache` / `reviewCache` — 模組層級快取，process 生命週期內只讀一次
  - 主要匯出：`getNovels()`, `getReviews()`, `getAllBooks()`, `getAllBooksWithChapters()`, `getBook(slug)`, `getChapter(slug, index)`

### 路由結構

| 路徑 | 說明 |
|------|------|
| `/` | 首頁，純靜態提示頁 |
| `/[bookSlug]/[chapterIndex]/` | 章節閱讀頁（SSG，736 頁靜態化） |
| `/stats/` | 字數統計（SSG，build 時計算） |
| `/sects/` | 門派總覽（Dynamic，因記憶體限制改為動態渲染） |

章節頁由 `generateStaticParams()` 呼叫 `getAllBooks()`（涵蓋小說+評論）預先生成全部路徑。

### UI 元件

- **`TopBar`**（Client Component）：書單下拉選單（optgroup 分組）、🏠 / 📊 / ⚔️ 連結按鈕、字級控制（A− / A+）、日/夜切換。使用者設定（字級、主題）存 localStorage，主題透過 `html.dark` / `html.light` class 套用。
- **`Sidebar`**（Client Component）：可收合的章節列表，側欄狀態存 localStorage。
- **`ChapterContent`**（Client Component）：內文顯示、左右鍵翻頁、HTML 預處理（壓縮 3 個以上連續 `<br>` 為 2 個）。

### 主題 / 樣式

`globals.css` 的色彩系統使用 CSS 自訂屬性（`--bg`, `--fg`, `--accent` 等），預設亮色，`@media (prefers-color-scheme: dark)` 與 `html.dark` class 雙重支援暗色模式，`html.light` class 可強制亮色（覆蓋系統設定）。

### 新增書本的流程

1. 把 `${書名}-reader.html` 放入 `Books/`（小說）或 `Review/`（評論）
2. 在 `書目.md`（或 `Review/評論.md`）加入 `《書名》`
3. 在 `lib/slug.ts` 的對應 map 新增 `'書名': 'slug'`
4. `npm run build` 驗證無誤後 `git push`

### 注意事項

- `Books/` 與 `Review/` 目錄名稱大小寫敏感（Vercel 為 Linux 環境）
- `.vercelignore` 已清空，確保 `Books/` 和 `Review/` 跟著部署
- `trailingSlash: true`，所有內部連結需加尾部斜線（`/slug/0/`）
- `/sects/` 頁面標記 `export const dynamic = 'force-dynamic'`，避免 build 時 OOM
