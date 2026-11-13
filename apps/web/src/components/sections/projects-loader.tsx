import { projectsSource } from '~/lib/source';

import { ProjectsSection } from './projects-section';

/** Preview pictures come from the `previews` frontmatter of each project's MDX, keyed by slug. */
export function ProjectsLoader() {
  const previews: Record<string, string[]> = {};

  for (const page of projectsSource.getPages()) {
    const slug = page.slugs.join('/');
    // Pictures are language-neutral: the default-language file wins and `.en.mdx` repeats them.
    if (page.data.previews?.length && !previews[slug]) previews[slug] = page.data.previews;
  }

  return <ProjectsSection previews={previews} />;
}
