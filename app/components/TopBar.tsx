'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import type { BookMeta } from '@/lib/books';

interface Props {
  novels: BookMeta[];
  reviews: BookMeta[];
}

const FONT_SIZE_KEY = 'reading-font-size';
const THEME_KEY = 'reading-theme';
const DEFAULT_SIZE = 17;
const MIN_SIZE = 13;
const MAX_SIZE = 24;

export default function TopBar({ novels, reviews }: Props) {
  const router = useRouter();
  const params = useParams<{ bookSlug?: string }>();
  const currentSlug = params?.bookSlug;

  const [fontSize, setFontSize] = useState(DEFAULT_SIZE);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // 初始化：從 localStorage 讀取並套用
  useEffect(() => {
    const stored = localStorage.getItem(FONT_SIZE_KEY);
    const size = stored ? parseInt(stored, 10) : DEFAULT_SIZE;
    setFontSize(size);
    document.documentElement.style.setProperty('--reading-font-size', size + 'px');

    // 主題：優先用 localStorage，否則跟隨系統
    const savedTheme = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = savedTheme ?? (systemDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(initial);
  }, []);

  // 字級變動時套用 CSS 變數 + 存 localStorage
  useEffect(() => {
    document.documentElement.style.setProperty('--reading-font-size', fontSize + 'px');
    localStorage.setItem(FONT_SIZE_KEY, String(fontSize));
  }, [fontSize]);

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(next);
    localStorage.setItem(THEME_KEY, next);
  }

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

        {/* 回首頁 */}
        <Link
          href="/"
          className="rounded border px-2 py-1 text-sm transition-opacity hover:opacity-70"
          style={{ borderColor: 'var(--border)', color: 'var(--fg)', background: 'var(--bg)' }}
          aria-label="回首頁"
          title="回首頁"
        >
          🏠
        </Link>

        {/* 字數統計 */}
        <Link
          href="/stats/"
          className="rounded border px-2 py-1 text-sm transition-opacity hover:opacity-70"
          style={{ borderColor: 'var(--border)', color: 'var(--fg)', background: 'var(--bg)' }}
          aria-label="字數統計"
          title="字數統計"
        >
          📊
        </Link>

        {/* 門派總覽 */}
        <Link
          href="/sects/"
          className="rounded border px-2 py-1 text-sm transition-opacity hover:opacity-70"
          style={{ borderColor: 'var(--border)', color: 'var(--fg)', background: 'var(--bg)' }}
          aria-label="門派總覽"
          title="門派總覽"
        >
          ⚔️
        </Link>

      </div>

      <div className="flex items-center gap-3">
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

        {/* 日/夜切換 */}
        <button
          onClick={toggleTheme}
          className={btnBase}
          style={btnStyle}
          aria-label={theme === 'light' ? '切換深色模式' : '切換淺色模式'}
          title={theme === 'light' ? '切換深色模式' : '切換淺色模式'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        <div
          className="text-sm font-medium tracking-widest"
          style={{ color: 'var(--fg-muted)' }}
        >
          金庸武俠與評論
        </div>
      </div>
    </header>
  );
}
