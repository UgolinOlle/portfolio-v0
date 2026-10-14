import { getMDXComponents } from '~/components/core/mdx';
import { ArrowRightIcon } from '~/components/icons/ui';
import { DocsBody } from '~/layouts/docs/page';
import type { projectsSource } from '~/lib/source';

type ProjectPage = NonNullable<ReturnType<typeof projectsSource.getPage>>;

type ProjectMDXProps = {
  page: ProjectPage;
};

export const ProjectMDX = ({ page }: ProjectMDXProps) => {
  const MDX = page.data.body;
  const { title, description, stack, links } = page.data;

  return (
    <article>
      <header className="mb-10 flex flex-col items-start gap-4 border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <h1 className="text-3xl font-medium tracking-tight text-balance text-zinc-950 sm:text-4xl dark:text-zinc-50">
          {title}
        </h1>

        {description && (
          <p className="max-w-[60ch] text-base leading-relaxed text-pretty text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        )}

        {Boolean(stack?.length || links?.length) && (
          <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-3 pt-1">
            {stack && stack.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {stack.map((tech) => (
                  <li
                    className="rounded-md border border-zinc-200 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
                    key={tech}
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            )}

            {links && links.length > 0 && (
              <div className="flex flex-wrap items-center gap-4">
                {links.map((link) => (
                  <a
                    className="group inline-flex items-center gap-1 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50"
                    href={link.href}
                    key={link.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {link.label}
                    <ArrowRightIcon
                      aria-hidden="true"
                      className="size-3.5 -rotate-45 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </article>
  );
};
