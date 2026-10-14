'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { motion } from 'motion/react';
import type { ComponentType } from 'react';

import { useTranslation } from '~/components/core/i18n-provider';
import { DATABASES, FRAMEWORKS, LANGUAGES, TOOLS } from '~/components/icons';
import { TRANSITION_SECTION, VARIANTS_SECTION } from '~/lib/constants';

import { SectionHeading } from './section-heading';

type IconComponent = ComponentType<{ className?: string }>;

type SkillItemProps = {
  name: string;
  icon: IconComponent;
  iconDark?: IconComponent;
};

const ICON_CLASS_NAME =
  'h-4 w-4 transform transition-all duration-200 ease-in-out group-hover:-rotate-15';

function SkillItem({ name, icon: Icon, iconDark: IconDark }: SkillItemProps) {
  return (
    <motion.div
      className={cn(
        'group flex w-fit items-center gap-2 rounded-sm px-2 py-0.5 text-foreground/80',
        'border border-primary/20 transition-all duration-200 hover:bg-primary-foreground',
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Render both variants and let CSS pick, so server and client markup match. */}
      {IconDark ? (
        <>
          <Icon className={cn(ICON_CLASS_NAME, 'dark:hidden')} />
          <IconDark className={cn(ICON_CLASS_NAME, 'hidden dark:block')} />
        </>
      ) : (
        <Icon className={ICON_CLASS_NAME} />
      )}
      <span className="text-sm">{name}</span>
    </motion.div>
  );
}

function StacksSection() {
  const { t } = useTranslation();

  const skillsData = {
    languages: [
      { name: 'TypeScript', icon: LANGUAGES.Typescript },
      { name: 'Javascript', icon: LANGUAGES.Javascript },
      { name: 'HTML', icon: LANGUAGES.HTML },
      { name: 'CSS', icon: LANGUAGES.CSS },
      { name: 'C', icon: LANGUAGES.C },
      { name: 'Lua', icon: LANGUAGES.Lua },
      { name: 'Bash', icon: LANGUAGES.BashDark, iconDark: LANGUAGES.BashLight },
    ],
    frameworks: [
      { name: 'React', icon: FRAMEWORKS.React },
      { name: 'Node.js', icon: FRAMEWORKS.NodeJS },
      { name: 'Next.js', icon: FRAMEWORKS.Nextjs },
      { name: 'Tailwind CSS', icon: FRAMEWORKS.Tailwind },
      { name: 'Shadcn/ui', icon: FRAMEWORKS.Shadcnui },
      { name: 'NestJS', icon: FRAMEWORKS.Nestjs },
      { name: 'Hono', icon: FRAMEWORKS.Hono },
    ],
    tools: [
      { name: 'GitHub', icon: TOOLS.GitHub },
      { name: 'VSCode', icon: TOOLS.VSCode },
      { name: 'Neovim', icon: TOOLS.Neovim },
      { name: 'Figma', icon: TOOLS.Figma },
      { name: 'Bun', icon: TOOLS.Bun },
      { name: 'Anthropic', icon: TOOLS.Anthropic },
    ],
    devops: [
      { name: 'Docker', icon: TOOLS.Docker },
      { name: 'Vercel', icon: TOOLS.Vercel },
      { name: 'Nginx', icon: TOOLS.Nginx },
    ],
    databases: [
      { name: 'PostgreSQL', icon: DATABASES.Postgres },
      { name: 'Prisma', icon: DATABASES.PrismaDark, iconDark: DATABASES.PrismaLight },
      { name: 'Redis', icon: DATABASES.Redis },
    ],
  };

  return (
    <motion.section
      transition={TRANSITION_SECTION}
      variants={VARIANTS_SECTION}
      className="space-y-8"
      id="stacks"
    >
      <SectionHeading>{t('sections.stacks')}</SectionHeading>

      {Object.entries(skillsData).map(([category, skills], categoryIndex) => (
        <div key={categoryIndex}>
          <h3 className="mb-4 text-lg font-medium">{t(`stacks.categories.${category}`)}</h3>

          <div className="flex flex-wrap gap-x-1 gap-y-2">
            {skills.map((skill, skillIndex) => (
              <div key={skillIndex}>
                <SkillItem {...skill} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.section>
  );
}

export { StacksSection };
