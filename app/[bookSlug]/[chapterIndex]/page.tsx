import { notFound } from 'next/navigation';
import Sidebar from '@/app/components/Sidebar';
import ChapterContent from '@/app/components/ChapterContent';
import { getAllBooks, getBook } from '@/lib/books';

interface PageProps {
  params: Promise<{ bookSlug: string; chapterIndex: string }>;
}

export function generateStaticParams() {
  return getAllBooks().flatMap((book) =>
    Array.from({ length: book.chapterCount }, (_, i) => ({
      bookSlug: book.slug,
      chapterIndex: String(i),
    })),
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { bookSlug, chapterIndex } = await params;
  const book = getBook(bookSlug);
  if (!book) return { title: '金庸文庫' };
  const chapter = book.chapters[Number(chapterIndex)];
  return {
    title: `${chapter?.title ?? ''} - ${book.title} | 金庸文庫`,
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const { bookSlug, chapterIndex } = await params;
  const book = getBook(bookSlug);
  if (!book) notFound();
  const idx = Number(chapterIndex);
  const chapter = book.chapters[idx];
  if (!chapter) notFound();

  const chapterRefs = book.chapters.map((c, i) => ({ title: c.title, index: i }));

  return (
    <>
      <Sidebar
        bookSlug={book.slug}
        bookTitle={book.title}
        currentIndex={idx}
        chapters={chapterRefs}
      />
      <ChapterContent
        bookSlug={book.slug}
        chapterTitle={chapter.title}
        chapterHtml={chapter.content}
        currentIndex={idx}
        total={book.chapters.length}
      />
    </>
  );
}
