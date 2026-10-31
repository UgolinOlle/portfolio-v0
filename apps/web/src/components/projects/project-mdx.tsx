import { Toc } from '~/components/core/toc';
import { ArrowRightIcon } from '~/components/icons/ui';
import { getMDXComponents } from '~/components/mdx/mdx';
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
    <article className="relative md:has-[>aside]:pl-48 xl:has-[>aside]:pl-0">
      <Toc items={page.data.toc} />
      <header className="mb-12 flex flex-col items-start gap-5 border-b border-zinc-200/70 pb-10 dark:border-zinc-800/70">
        <h1 className="text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-zinc-950 sm:text-5xl dark:text-zinc-50">
          {title}
        </h1>

        {description && (
          <p className="max-w-[52ch] text-lg leading-normal text-pretty text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        )}

        {Boolean(stack?.length || links?.length) && (
          <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-3 pt-1">
            {stack && stack.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {stack.map((tech) => (
                  <li
                    className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
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
                    className="group inline-flex items-center gap-1 text-base font-medium text-zinc-700 transition-colors hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50"
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
