'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  bookSlug: string;
  chapterTitle: string;
  chapterHtml: string;
  currentIndex: number;
  total: number;
}

export default function ChapterContent({
  bookSlug,
  chapterTitle,
  chapterHtml,
  currentIndex,
  total,
}: Props) {
  const router = useRouter();
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < total - 1;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLElement) {
        const tag = e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      }
      if (e.key === 'ArrowLeft' && hasPrev) {
        e.preventDefault();
        router.push(`/${bookSlug}/${currentIndex - 1}/`);
      } else if (e.key === 'ArrowRight' && hasNext) {
        e.preventDefault();
        router.push(`/${bookSlug}/${currentIndex + 1}/`);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [bookSlug, currentIndex, hasPrev, hasNext, router]);

  return (
    <main className="flex flex-1 flex-col overflow-y-auto">
      <article className="mx-auto w-full max-w-[760px] px-6 py-10 sm:px-10">
        <h1
          className="mb-8 border-b pb-4 text-2xl font-semibold tracking-widest"
          style={{ borderColor: 'var(--border)' }}
        >
          {chapterTitle}
        </h1>
        <div
          className="chapter-body"
          dangerouslySetInnerHTML={{ __html: chapterHtml }}
        />
      </article>
      <nav
        className="sticky bottom-0 border-t backdrop-blur"
        style={{
          borderColor: 'var(--border)',
          background: 'color-mix(in srgb, var(--bg-elevated) 92%, transparent)',
        }}
      >
        <div className="mx-auto flex w-full max-w-[760px] items-center justify-between px-6 py-3 sm:px-10">
          <button
            onClick={() =>
              hasPrev && router.push(`/${bookSlug}/${currentIndex - 1}/`)
            }
            disabled={!hasPrev}
            className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-40"
            style={{ borderColor: 'var(--border)', color: 'var(--fg)' }}
          >
            ← 上一回
          </button>
          <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>
            {currentIndex + 1} / {total}　·　← → 切換
          </span>
          <button
            onClick={() =>
              hasNext && router.push(`/${bookSlug}/${currentIndex + 1}/`)
            }
            disabled={!hasNext}
            className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-40"
            style={{ borderColor: 'var(--border)', color: 'var(--fg)' }}
          >
            下一回 →
          </button>
        </div>
      </nav>
    </main>
  );
}
