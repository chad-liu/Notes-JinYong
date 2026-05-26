'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { BookMeta } from '@/lib/books';

interface Props {
  novels: BookMeta[];
  reviews: BookMeta[];
}

const FONT_SIZE_KEY = 'reading-font-size';
const DEFAULT_SIZE = 17;
const MIN_SIZE = 13;
const MAX_SIZE = 24;

export default function TopBar({ novels, reviews }: Props) {
  const router = useRouter();
  const params = useParams<{ bookSlug?: string }>();
  const currentSlug = params?.bookSlug;

  const [fontSize, setFontSize] = useState(DEFAULT_SIZE);

  // 初始化：從 localStorage 讀取並套用
  useEffect(() => {
    const stored = localStorage.getItem(FONT_SIZE_KEY);
    const size = stored ? parseInt(stored, 10) : DEFAULT_SIZE;
    setFontSize(size);
    document.documentElement.style.setProperty('--reading-font-size', size + 'px');
  }, []);

  // 字級變動時套用 CSS 變數 + 存 localStorage
  useEffect(() => {
    document.documentElement.style.setProperty('--reading-font-size', fontSize + 'px');
    localStorage.setItem(FONT_SIZE_KEY, String(fontSize));
  }, [fontSize]);

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const slug = e.target.value;
    if (slug) router.push(`/${slug}/0/`);
  }

  function decrease() {
    setFontSize((prev) => Math.max(prev - 1, MIN_SIZE));
  }

  function increase() {
    setFontSize((prev) => Math.min(prev + 1, MAX_SIZE));
  }

  const btnBase =
    'rounded border px-2 py-1 text-xs font-medium transition-opacity disabled:opacity-30';
  const btnStyle = { borderColor: 'var(--border)', color: 'var(--fg)', background: 'var(--bg)' };

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
          <optgroup label="金庸小說">
            {novels.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.title}
              </option>
            ))}
          </optgroup>
          <optgroup label="評論">
            {reviews.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.title}
              </option>
            ))}
          </optgroup>
        </select>

        {/* 字級控制 */}
        <div className="flex items-center gap-1">
          <button
            onClick={decrease}
            disabled={fontSize <= MIN_SIZE}
            className={btnBase}
            style={btnStyle}
            aria-label="縮小字體"
            title="縮小字體"
          >
            A−
          </button>
          <span className="w-8 text-center text-xs tabular-nums" style={{ color: 'var(--fg-muted)' }}>
            {fontSize}
          </span>
          <button
            onClick={increase}
            disabled={fontSize >= MAX_SIZE}
            className={btnBase}
            style={btnStyle}
            aria-label="放大字體"
            title="放大字體"
          >
            A+
          </button>
        </div>
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
