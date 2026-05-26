# 金庸文庫

整合 14 本金庸小說 reader.html 的閱讀網站，使用 Next.js App Router 建置。

## 開發

```bash
pnpm install
pnpm dev
```

開啟 http://localhost:3000 。

## 結構

- `Books/` — 原始 reader.html（資料來源，不部署）
- `書目.md` — 書籍順序
- `lib/books.ts` — build 時解析 chapters
- `app/` — Next.js App Router 頁面與元件

## 部署

推送到 GitHub `chad-liu/Notes-JinYong`，Vercel 自動偵測 Next.js 並部署。
