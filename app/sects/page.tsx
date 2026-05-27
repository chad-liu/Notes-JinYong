import { getAllBooksWithChapters } from '@/lib/books';

// 比對常見武俠門派後綴
const SECT_REGEX = /[一-鿿]{1,6}(?:派|幫|教|門|宗|盟|堂|閣|莊|谷|宮)/g;

// 排除常見誤判詞
const EXCLUDE = new Set([
  '門派', '派別', '派頭', '派系', '派人', '派兵', '派遣', '派出',
  '幫助', '幫忙', '幫手', '幫兇', '幫倒', '幫我',
  '教導', '教訓', '教書', '教人', '教學', '教義', '教化', '教條',
  '宗旨', '宗教', '宗族', '宗親',
  '堂堂', '堂兄', '堂弟', '堂妹', '堂姐', '堂叔', '堂伯', '堂皇',
  '閣下', '閣樓',
  '莊嚴', '莊重', '莊稼', '莊園',
  '一派', '這派', '那派',
  '門口', '門前', '門路', '門檻', '門第',
]);

function extractSects(html: string): Set<string> {
  const text = html.replace(/<[^>]+>/g, '');
  const matches = text.match(SECT_REGEX) ?? [];
  const result = new Set<string>();
  for (const m of matches) {
    if (!EXCLUDE.has(m)) result.add(m);
  }
  return result;
}

export const metadata = { title: '門派總覽 | 金庸武俠與評論' };

export default function SectsPage() {
  const books = getAllBooksWithChapters().filter(
    (b) => b.collection === 'novel',
  );

  // sect -> 出現的書名 Set
  const sectBooks = new Map<string, Set<string>>();

  for (const book of books) {
    const allSects = new Set<string>();
    for (const ch of book.chapters) {
      for (const s of extractSects(ch.content)) {
        allSects.add(s);
      }
    }
    for (const s of allSects) {
      if (!sectBooks.has(s)) sectBooks.set(s, new Set());
      sectBooks.get(s)!.add(book.title);
    }
  }

  // 排序：出現書籍數由多到少，相同則按筆畫（字典序）
  const rows = [...sectBooks.entries()]
    .sort((a, b) => b[1].size - a[1].size || a[0].localeCompare(b[0], 'zh-Hant'))
    .map(([sect, titles]) => ({ sect, titles: [...titles] }));

  return (
    <main className="flex-1 overflow-y-auto px-6 py-10">
      <div className="mx-auto max-w-[760px]">
        <h1
          className="mb-1 border-b pb-3 text-xl font-semibold tracking-widest"
          style={{ borderColor: 'var(--border)', color: 'var(--fg)' }}
        >
          門派總覽
        </h1>
        <p className="mb-6 text-xs tracking-widest" style={{ color: 'var(--fg-muted)' }}>
          以正則表達式自動擷取，共 {rows.length} 個門派，依出現書籍數排列
        </p>

        <table className="w-full text-sm" style={{ color: 'var(--fg)' }}>
          <thead>
            <tr
              className="border-b text-left text-xs tracking-widest"
              style={{ borderColor: 'var(--border)', color: 'var(--fg-muted)' }}
            >
              <th className="pb-2 pr-4 font-medium">門派</th>
              <th className="pb-2 pr-3 font-medium w-8 text-center">書籍數</th>
              <th className="pb-2 font-medium">出現於</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ sect, titles }) => (
              <tr
                key={sect}
                className="border-b"
                style={{ borderColor: 'var(--border)' }}
              >
                <td className="py-2 pr-4 font-medium whitespace-nowrap">{sect}</td>
                <td
                  className="py-2 pr-3 text-center tabular-nums"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  {titles.length}
                </td>
                <td className="py-2 text-sm" style={{ color: 'var(--fg-muted)' }}>
                  {titles.join('、')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
