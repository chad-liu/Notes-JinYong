import fs from 'node:fs';
import path from 'node:path';
import { getAllBooksWithChapters } from '@/lib/books';

export const dynamic = 'force-dynamic';

function loadSectList(): string[] {
  const file = path.join(process.cwd(), 'Books', '門派.md');
  return fs
    .readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function countInText(html: string, term: string): number {
  const text = html.replace(/<[^>]+>/g, '');
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return (text.match(new RegExp(escaped, 'g')) ?? []).length;
}

export const metadata = { title: '門派總覽 | 金庸武俠與評論' };

export default function SectsPage() {
  const sects = loadSectList();
  const novels = getAllBooksWithChapters().filter((b) => b.collection === 'novel');

  // 預先把每本書的全文合併（去 HTML 標籤）
  const bookTexts = novels.map((book) => ({
    title: book.title,
    text: book.chapters.map((ch) => ch.content.replace(/<[^>]+>/g, '')).join(''),
  }));

  // 每個門派 → [{title, count}] 由多到少，只留 count > 0 的書
  const rows = sects.map((sect) => {
    const books = bookTexts
      .map(({ title, text }) => {
        const escaped = sect.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const count = (text.match(new RegExp(escaped, 'g')) ?? []).length;
        return { title, count };
      })
      .filter((b) => b.count > 0)
      .sort((a, b) => b.count - a.count);
    return { sect, books };
  });

  return (
    <main className="flex-1 overflow-y-auto px-6 py-10">
      <div className="mx-auto max-w-[800px]">
        <h1
          className="mb-6 border-b pb-3 text-xl font-semibold tracking-widest"
          style={{ borderColor: 'var(--border)', color: 'var(--fg)' }}
        >
          門派總覽
        </h1>

        <ul className="space-y-3">
          {rows.map(({ sect, books }) => (
            <li key={sect} className="text-sm leading-relaxed">
              <span className="font-semibold" style={{ color: 'var(--fg)' }}>
                {sect}
              </span>
              {books.length > 0 ? (
                <>
                  <span style={{ color: 'var(--fg-muted)' }}> — </span>
                  <span style={{ color: 'var(--fg-muted)' }}>
                    {books
                      .map((b) => `${b.title}(${b.count.toLocaleString()})`)
                      .join('、')}
                  </span>
                </>
              ) : (
                <span style={{ color: 'var(--fg-muted)' }}> — 未出現</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
