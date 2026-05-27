import { getAllBooksWithChapters } from '@/lib/books';

function countCjk(html: string): number {
  const text = html.replace(/<[^>]+>/g, '');
  return (text.match(/[一-鿿]/g) ?? []).length;
}

function formatCount(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + ' 萬';
  return n.toLocaleString();
}

export const metadata = { title: '字數統計 | 金庸武俠與評論' };

export default function StatsPage() {
  const books = getAllBooksWithChapters();

  const rows = books
    .map((book) => {
      const count = book.chapters.reduce(
        (sum, ch) => sum + countCjk(ch.content),
        0,
      );
      return { title: book.title, collection: book.collection, count };
    })
    .sort((a, b) => b.count - a.count);

  const novelTotal = rows
    .filter((r) => r.collection === 'novel')
    .reduce((s, r) => s + r.count, 0);

  const reviewTotal = rows
    .filter((r) => r.collection === 'review')
    .reduce((s, r) => s + r.count, 0);

  return (
    <main className="flex-1 overflow-y-auto px-6 py-10">
      <div className="mx-auto max-w-[600px]">
        <h1
          className="mb-6 border-b pb-3 text-xl font-semibold tracking-widest"
          style={{ borderColor: 'var(--border)', color: 'var(--fg)' }}
        >
          字數統計
        </h1>

        <table className="w-full text-sm" style={{ color: 'var(--fg)' }}>
          <thead>
            <tr
              className="border-b text-left text-xs tracking-widest"
              style={{ borderColor: 'var(--border)', color: 'var(--fg-muted)' }}
            >
              <th className="pb-2 pr-4 font-medium">排名</th>
              <th className="pb-2 pr-4 font-medium">書名</th>
              <th className="pb-2 pr-4 font-medium">類別</th>
              <th className="pb-2 text-right font-medium">字數</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.title}
                className="border-b"
                style={{ borderColor: 'var(--border)' }}
              >
                <td
                  className="py-2.5 pr-4 tabular-nums"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  {i + 1}
                </td>
                <td className="py-2.5 pr-4 font-medium">{row.title}</td>
                <td className="py-2.5 pr-4" style={{ color: 'var(--fg-muted)' }}>
                  {row.collection === 'novel' ? '小說' : '評論'}
                </td>
                <td className="py-2.5 text-right tabular-nums">
                  {formatCount(row.count)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ color: 'var(--fg-muted)' }}>
              <td colSpan={3} className="pt-4 text-xs tracking-widest">
                小說合計
              </td>
              <td className="pt-4 text-right text-xs tabular-nums">
                {formatCount(novelTotal)}
              </td>
            </tr>
            <tr style={{ color: 'var(--fg-muted)' }}>
              <td colSpan={3} className="pt-1 text-xs tracking-widest">
                評論合計
              </td>
              <td className="pt-1 text-right text-xs tabular-nums">
                {formatCount(reviewTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </main>
  );
}
