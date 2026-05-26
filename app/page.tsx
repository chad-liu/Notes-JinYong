import { redirect } from 'next/navigation';
import { getDefaultBookSlug } from '@/lib/books';

export default function Home() {
  const slug = getDefaultBookSlug();
  redirect(`/${slug}/0/`);
}
