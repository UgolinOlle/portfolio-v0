import { RecentWritingsSection } from '~/components/writings/recent-writings-section';
import { writingsSource } from '~/lib/source';

const LANGUAGES = ['fr', 'en'] as const;

export function RecentWritingsLoader() {
  const pages = LANGUAGES.flatMap((lang) =>
    writingsSource.getPages(lang).map((page) => ({
      url: `/writings/${page.slugs.join('/')}`,
      title: page.data.title,
      description: page.data.description,
      date: page.data.date,
      category: page.data.category,
      lang,
    })),
  );

  return <RecentWritingsSection pages={pages} />;
}
