'use client';

import { useRouter, useParams } from 'next/navigation';
import type { BookMeta } from '@/lib/books';

interface Props {
  books: BookMeta[];
}

export default function TopBar({ books }: Props) {
  const router = useRouter();
  const params = useParams<{ bookSlug?: string }>();
  const currentSlug = params?.bookSlug;

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const slug = e.target.value;
    if (slug) router.push(`/${slug}/0/`);
  }

  return (
    <header
      className="flex h-14 flex-shrink-0 items-center justify-between border-b px-4"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}
    >
      <div className="flex items-center gap-4">
        <select
          value={currentSlug ?? ''}
          onChange={onChange}
          className="rounded-md border px-3 py-1.5 text-sm focus:outline-none focus:ring-2"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--bg)',
            color: 'var(--fg)',
          }}
          aria-label="選擇書籍"
        >
          <option value="" disabled>
            選擇書籍…
          </option>
          {books.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.title}
            </option>
          ))}
        </select>
      </div>
      <div
        className="text-sm font-medium tracking-widest"
        style={{ color: 'var(--fg-muted)' }}
      >
        金庸文庫
      </div>
    </header>
  );
}
