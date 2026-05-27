import fs from 'node:fs';
import path from 'node:path';
import { BOOK_SLUGS, REVIEW_SLUGS } from './slug';

export interface Chapter {
  title: string;
  content: string;
}

export interface BookMeta {
  slug: string;
  title: string;
  chapterCount: number;
  collection: 'novel' | 'review';
}

export interface Book extends BookMeta {
  chapters: Chapter[];
}

const ROOT = process.cwd();
const BOOKS_DIR = path.join(ROOT, 'Books');
const BOOKLIST_FILE = path.join(ROOT, '書目.md');
const REVIEW_DIR = path.join(ROOT, 'Review');
const REVIEW_LIST_FILE = path.join(ROOT, 'Review', '評論.md');

function readBookOrder(listFile: string): string[] {
  const raw = fs.readFileSync(listFile, 'utf8');
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^《|》$/g, '').trim())
    .filter(Boolean);
}

function parseChaptersFromHtml(filePath: string): Chapter[] {
  const html = fs.readFileSync(filePath, 'utf8');
  const match = html.match(/^const chapters = (\[[\s\S]*?\]);\s*$/m);
  if (!match) {
    throw new Error(`Cannot find chapters array in ${filePath}`);
  }
  const data = JSON.parse(match[1]) as Chapter[];
  return data;
}

function loadCollection(
  dir: string,
  listFile: string,
  slugMap: Record<string, string>,
  collection: 'novel' | 'review',
): Book[] {
  const order = readBookOrder(listFile);
  const books: Book[] = [];

  for (const title of order) {
    const slug = slugMap[title];
    if (!slug) continue;
    const filePath = path.join(dir, `${title}-reader.html`);
    if (!fs.existsSync(filePath)) continue;
    const chapters = parseChaptersFromHtml(filePath);
    books.push({ slug, title, chapterCount: chapters.length, chapters, collection });
  }

  return books;
}

let novelCache: Book[] | null = null;
let reviewCache: Book[] | null = null;

function loadNovels(): Book[] {
  if (novelCache) return novelCache;
  novelCache = loadCollection(BOOKS_DIR, BOOKLIST_FILE, BOOK_SLUGS, 'novel');
  return novelCache;
}

function loadReviews(): Book[] {
  if (reviewCache) return reviewCache;
  reviewCache = loadCollection(REVIEW_DIR, REVIEW_LIST_FILE, REVIEW_SLUGS, 'review');
  return reviewCache;
}

export function getNovels(): BookMeta[] {
  return loadNovels().map(({ slug, title, chapterCount, collection }) => ({
    slug,
    title,
    chapterCount,
    collection,
  }));
}

export function getReviews(): BookMeta[] {
  return loadReviews().map(({ slug, title, chapterCount, collection }) => ({
    slug,
    title,
    chapterCount,
    collection,
  }));
}

export function getAllBooks(): BookMeta[] {
  return [...getNovels(), ...getReviews()];
}

export function getAllBooksWithChapters(): Book[] {
  return [...loadNovels(), ...loadReviews()];
}

export function getBook(slug: string): Book | undefined {
  return (
    loadNovels().find((b) => b.slug === slug) ??
    loadReviews().find((b) => b.slug === slug)
  );
}

export function getChapter(slug: string, index: number): Chapter | undefined {
  return getBook(slug)?.chapters[index];
}

export function getDefaultBookSlug(): string {
  return loadNovels()[0]?.slug ?? '';
}

export { BOOK_SLUGS };
