'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { m } from 'motion/react';
import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import {
  SiGit,
  SiGithubactions,
  SiGrafana,
  SiLaravel,
  SiMysql,
  SiPhp,
  SiPrometheus,
  SiPython,
  SiSwift,
  SiXcode,
} from 'react-icons/si';

import { useTranslation } from '~/components/core/i18n-provider';
import { DATABASES, FRAMEWORKS, LANGUAGES, TOOLS } from '~/components/icons';
import { SECTION_REVEAL_LIST, TRANSITION_SECTION, VARIANTS_SECTION } from '~/lib/constants';

import { HomeHeading } from './home-heading';

type IconFactory = () => React.ComponentType<{ className?: string }>;

type SkillItemProps = {
  name: string;
  icon: React.ComponentType<{ className?: string }> | IconFactory | ReactNode;
};

function SkillItem({ name, icon }: SkillItemProps) {
  const IconComponent =
    typeof icon === 'function' && (icon as IconFactory).length === 0
      ? (icon as IconFactory)()
      : (icon as React.ComponentType<{ className?: string }>);

  return (
    // Not interactive: hover only tints the pill, it must not suggest a click.
    <div
      className={cn(
        'flex w-fit items-center gap-2 rounded-full px-2.5 py-0.5 text-foreground/80',
        'border border-primary/20 transition-colors duration-150 motion-reduce:transition-none',
        'hover:border-primary/40 hover:bg-primary-foreground',
      )}
    >
      {/* The visible name labels the tool, so the logo is decorative. */}
      <span aria-hidden="true" className="flex">
        <IconComponent className="h-4 w-4" />
      </span>
      <span className="text-sm">{name}</span>
    </div>
  );
}

type LogoComponent = React.ComponentType<{ className?: string }>;

// Renders both logo variants and lets CSS pick one, so the markup doesn't depend on the theme
// (resolving it in JS made the server and client render different icons).
const themedLogo = (OnLight: LogoComponent, OnDark: LogoComponent): LogoComponent => {
  const ThemedLogo = ({ className }: { className?: string }) => (
    <>
      <OnLight className={cn(className, 'dark:hidden')} />
      <OnDark className={cn(className, 'hidden dark:block')} />
    </>
  );

  return ThemedLogo;
};

// Simple Icons are single-path glyphs, so paint them in the brand color to match the other logos.
const brandLogo = (Icon: IconType, color: string): LogoComponent => {
  const BrandLogo = ({ className }: { className?: string }) => (
    <Icon className={className} color={color} />
  );

  return BrandLogo;
};

const BashLogo = themedLogo(LANGUAGES.BashDark, LANGUAGES.BashLight);
const PrismaLogo = themedLogo(DATABASES.PrismaDark, DATABASES.PrismaLight);
const PhpLogo = brandLogo(SiPhp, '#777BB4');
const PythonLogo = brandLogo(SiPython, '#3776AB');
const SwiftLogo = brandLogo(SiSwift, '#F05138');
const LaravelLogo = brandLogo(SiLaravel, '#FF2D20');
// MySQL's brand blue disappears on the dark background, so dark mode gets a lighter tint.
const MysqlLogo = themedLogo(brandLogo(SiMysql, '#4479A1'), brandLogo(SiMysql, '#5FA8D3'));
const GitLogo = brandLogo(SiGit, '#F05032');
const GithubActionsLogo = brandLogo(SiGithubactions, '#2088FF');
const GrafanaLogo = brandLogo(SiGrafana, '#F46800');
const PrometheusLogo = brandLogo(SiPrometheus, '#E6522C');
// Xcode's brand blue reads fine on both backgrounds, so it needs no dark-mode variant.
const XcodeLogo = brandLogo(SiXcode, '#147EFB');

type Skill = { name: string; labelKey?: string; icon: SkillItemProps['icon'] };

// Grouped to mirror the CV: dev stack first, then the systems & networks side of the profile.
const SKILLS: Record<string, Skill[]> = {
  languages: [
    { name: 'TypeScript', icon: LANGUAGES.Typescript },
    { name: 'JavaScript', icon: LANGUAGES.Javascript },
    { name: 'PHP', icon: PhpLogo },
    { name: 'Python', icon: PythonLogo },
    { name: 'Swift', icon: SwiftLogo },
    { name: 'C', icon: LANGUAGES.C },
    { name: 'Lua', icon: LANGUAGES.Lua },
    { name: 'Bash', icon: BashLogo },
    { name: 'HTML', icon: LANGUAGES.HTML },
    { name: 'CSS', icon: LANGUAGES.CSS },
  ],
  frameworks: [
    { name: 'React', icon: FRAMEWORKS.React },
    { name: 'Next.js', icon: FRAMEWORKS.Nextjs },
    { name: 'Node.js', icon: FRAMEWORKS.NodeJS },
    { name: 'NestJS', icon: FRAMEWORKS.Nestjs },
    { name: 'Hono', icon: FRAMEWORKS.Hono },
    { name: 'Laravel', icon: LaravelLogo },
    { name: 'Tailwind CSS', icon: FRAMEWORKS.Tailwind },
    { name: 'Shadcn/ui', icon: FRAMEWORKS.Shadcnui },
  ],
  databases: [
    { name: 'PostgreSQL', icon: DATABASES.Postgres },
    { name: 'MySQL', icon: MysqlLogo },
    { name: 'Prisma', icon: PrismaLogo },
    { name: 'Redis', icon: DATABASES.Redis },
  ],
  devops: [
    { name: 'Docker', icon: TOOLS.Docker },
    { name: 'Nginx', icon: TOOLS.Nginx },
    { name: 'Vercel', icon: TOOLS.Vercel },
    { name: 'GitHub Actions', icon: GithubActionsLogo },
    { name: 'Grafana', icon: GrafanaLogo },
    { name: 'Prometheus', icon: PrometheusLogo },
    { name: 'Loki', icon: TOOLS.Loki },
  ],
  tools: [
    { name: 'Git', icon: GitLogo },
    { name: 'GitHub', icon: TOOLS.GitHub },
    { name: 'Neovim', icon: TOOLS.Neovim },
    { name: 'VSCode', icon: TOOLS.VSCode },
    { name: 'Xcode', icon: XcodeLogo },
    { name: 'Bun', icon: TOOLS.Bun },
    { name: 'Figma', icon: TOOLS.Figma },
    { name: 'Claude', icon: TOOLS.Anthropic },
  ],
};

function StacksSection() {
  const { t } = useTranslation();

  return (
    <m.section {...SECTION_REVEAL_LIST} className="space-y-8" id="stacks">
      <HomeHeading>{t('sections.stacks')}</HomeHeading>

      {/* Spec sheet: same blueprint language as the project cards, but static (this text is read, not clicked). */}
      <m.div
        className="relative overflow-hidden rounded-2xl bg-zinc-900/[0.03] dark:bg-zinc-50/[0.03]"
        transition={TRANSITION_SECTION}
        variants={VARIANTS_SECTION}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-px translate-x-[9.5rem] bg-gradient-to-b from-transparent via-zinc-400/60 to-transparent sm:block"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 hidden size-1.5 translate-x-[9.5rem] -translate-y-1/2 rounded-full bg-zinc-500/60 sm:block"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 hidden size-1.5 translate-x-[9.5rem] translate-y-1/2 rounded-full bg-zinc-500/60 sm:block"
        />

        <dl className="divide-y divide-zinc-400/25">
          {Object.entries(SKILLS).map(([category, skills]) => (
            <div
              className="flex flex-col gap-2.5 px-4 py-4 sm:flex-row sm:gap-0 sm:py-5"
              key={category}
            >
              <dt className="text-sm font-medium text-zinc-600 sm:w-[9.5rem] sm:shrink-0 sm:pr-4 dark:text-zinc-400">
                {t(`stacks.categories.${category}`)}
                {/* Inline so the count follows the name, even when the name wraps. */}
                <span className="ml-2 inline-block rounded-full bg-zinc-900/[0.05] px-1.5 text-xs text-zinc-500 tabular-nums dark:bg-zinc-50/[0.08] dark:text-zinc-400">
                  {skills.length}
                </span>
              </dt>
              {/* content-start: otherwise a one-line list stretches its chips to the row height. */}
              <dd className="flex flex-wrap content-start gap-x-1.5 gap-y-2 sm:pl-5">
                {skills.map((skill) => (
                  <SkillItem
                    icon={skill.icon}
                    key={skill.name}
                    name={skill.labelKey ? t(skill.labelKey) : skill.name}
                  />
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </m.div>
    </m.section>
  );
}

export { StacksSection };
