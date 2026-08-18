import { getMDXComponents } from '~/components/mdx';
import { DocsBody, DocsDescription, DocsTitle } from '~/layouts/docs/page';
import type { projectsSource } from '~/lib/source';

type ProjectPage = NonNullable<ReturnType<typeof projectsSource.getPage>>;

type ProjectMDXProps = {
  page: ProjectPage;
};

export const ProjectMDX = ({ page }: ProjectMDXProps) => {
  const MDX = page.data.body;

  return (
    <article>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>

      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </article>
  );
};
