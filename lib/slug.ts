export const BOOK_SLUGS: Record<string, string> = {
  '越女劍': 'yuenu-jian',
  '天龍八部': 'tianlong-babu',
  '射鵰英雄傳': 'shediao',
  '神鵰俠侶': 'shendiao',
  '倚天屠龍記': 'yitian',
  '笑傲江湖': 'xiaoao',
  '俠客行': 'xiake-xing',
  '碧血劍': 'bixue',
  '鹿鼎記': 'luding',
  '連城訣': 'liancheng',
  '鴛鴦刀': 'yuanyang-dao',
  '白馬嘯西風': 'baima',
  '書劍恩仇錄': 'shujian',
  '雪山飛狐': 'xueshan',
  '飛狐外傳': 'feihu',
};

export const REVIEW_SLUGS: Record<string, string> = {
  '編年和人物大全': 'review-1',
  '曾經江湖': 'review-2',
  '流轉江湖': 'review-3',
  '再會江湖': 'review-4',
  '正與邪': 'review-5',
  '六神磊磊-你我皆凡人': 'review-6',
  '六神磊磊-現實江湖': 'review-7',
};

export const SLUG_TO_TITLE: Record<string, string> = Object.fromEntries(
  [...Object.entries(BOOK_SLUGS), ...Object.entries(REVIEW_SLUGS)].map(
    ([title, slug]) => [slug, title],
  ),
);

export function titleToSlug(title: string): string | undefined {
  return BOOK_SLUGS[title];
}

export function reviewTitleToSlug(title: string): string | undefined {
  return REVIEW_SLUGS[title];
}

export function slugToTitle(slug: string): string | undefined {
  return SLUG_TO_TITLE[slug];
}
