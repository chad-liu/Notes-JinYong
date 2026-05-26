import fs from 'node:fs';
import path from 'node:path';
import { BOOK_SLUGS, titleToSlug } from './slug';

export interface Chapter {
  title: string;
  content: string;
}

export interface BookMeta {
  slug: string;
  title: string;
  chapterCount: number;
}

export interface Book extends BookMeta {
  chapters: Chapter[];
}

const ROOT = process.cwd();
const BOOKS_DIR = path.join(ROOT, 'Books');
const BOOKLIST_FILE = path.join(ROOT, '書目.md');

function readBookOrder(): string[] {
  const raw = fs.readFileSync(BOOKLIST_FILE, 'utf8');
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

let cache: Book[] | null = null;

function loadAllBooks(): Book[] {
  if (cache) return cache;

  const order = readBookOrder();
  const books: Book[] = [];

  for (const title of order) {
    const slug = titleToSlug(title);
    if (!slug) continue;
    const filePath = path.join(BOOKS_DIR, `${title}-reader.html`);
    if (!fs.existsSync(filePath)) continue;
    const chapters = parseChaptersFromHtml(filePath);
    books.push({ slug, title, chapterCount: chapters.length, chapters });
  }

  cache = books;
  return books;
}

export function getAllBooks(): BookMeta[] {
  return loadAllBooks().map(({ slug, title, chapterCount }) => ({
    slug,
    title,
    chapterCount,
  }));
}

export function getBook(slug: string): Book | undefined {
  return loadAllBooks().find((b) => b.slug === slug);
}

export function getChapter(slug: string, index: number): Chapter | undefined {
  return getBook(slug)?.chapters[index];
}

export function getDefaultBookSlug(): string {
  return loadAllBooks()[0]?.slug ?? '';
}

export { BOOK_SLUGS };
