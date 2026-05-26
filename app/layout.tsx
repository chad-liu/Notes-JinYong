import type { Metadata } from 'next';
import { Noto_Sans_TC } from 'next/font/google';
import { getAllBooks } from '@/lib/books';
import TopBar from './components/TopBar';
import './globals.css';

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-sans-tc',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '金庸文庫',
  description: '金庸武俠小說線上閱讀',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const books = getAllBooks();

  return (
    <html lang="zh-Hant" className={notoSansTC.variable}>
      <body className="font-sans">
        <div className="flex h-screen flex-col">
          <TopBar books={books} />
          <div className="flex flex-1 overflow-hidden">{children}</div>
        </div>
      </body>
    </html>
  );
}
