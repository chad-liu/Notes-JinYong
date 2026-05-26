'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ChapterRef {
  title: string;
  index: number;
}

interface Props {
  bookSlug: string;
  bookTitle: string;
  currentIndex: number;
  chapters: ChapterRef[];
}

const STORAGE_KEY = 'sidebar-collapsed';

export default function Sidebar({
  bookSlug,
  bookTitle,
  currentIndex,
  chapters,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === '1') setCollapsed(true);
  }, []);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      return next;
    });
  }

  if (collapsed) {
    return (
      <aside
        className="flex w-10 flex-shrink-0 flex-col items-center border-r py-3"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--bg-elevated)',
        }}
      >
        <button
          onClick={toggle}
          className="rounded p-1.5 text-lg hover:bg-black/5 dark:hover:bg-white/5"
          aria-label="展開側欄"
          title="展開側欄"
        >
          ☰
        </button>
      </aside>
    );
  }

  return (
    <aside
      className="flex w-64 flex-shrink-0 flex-col border-r"
      style={{
        borderColor: 'var(--border)',
        background: 'var(--bg-elevated)',
      }}
    >
      <div
        className="flex items-center justify-between border-b px-4 py-3"
        style={{ borderColor: 'var(--border)' }}
      >
        <div>
          <div className="text-sm font-semibold tracking-wider">{bookTitle}</div>
        </div>
        <button
          onClick={toggle}
          className="rounded p-1 text-sm hover:bg-black/5 dark:hover:bg-white/5"
          aria-label="收合側欄"
          title="收合側欄"
        >
          ◀
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {chapters.map((ch) => {
          const isActive = ch.index === currentIndex;
          return (
            <Link
              key={ch.index}
              href={`/${bookSlug}/${ch.index}/`}
              className="block border-l-2 px-4 py-2 text-sm transition-colors"
              style={{
                borderColor: isActive ? 'var(--accent)' : 'transparent',
                background: isActive ? 'var(--accent-soft)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--fg-muted)',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {ch.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
