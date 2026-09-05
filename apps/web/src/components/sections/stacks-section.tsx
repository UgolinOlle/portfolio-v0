'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import type { ReactNode } from 'react';

import { useTranslation } from '~/components/core/i18n-provider';
import { DATABASES, FRAMEWORKS, LANGUAGES, TOOLS } from '~/components/icons';
import { TRANSITION_SECTION, VARIANTS_SECTION } from '~/lib/constants';

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
    <motion.div
      className={cn(
        'group flex w-fit items-center gap-2 rounded-sm px-2 py-0.5 text-foreground/80',
        'border border-primary/20 transition-all duration-200 hover:bg-primary-foreground',
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <IconComponent className="h-4 w-4 transform transition-all duration-200 ease-in-out group-hover:-rotate-15" />
      <span className="text-sm">{name}</span>
    </motion.div>
  );
}

function StacksSection() {
  const { t } = useTranslation();
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;

  const skillsData = {
    languages: [
      { name: 'TypeScript', icon: LANGUAGES.Typescript },
      { name: 'Javascript', icon: LANGUAGES.Javascript },
      { name: 'HTML', icon: LANGUAGES.HTML },
      { name: 'CSS', icon: LANGUAGES.CSS },
      { name: 'C', icon: LANGUAGES.C },
      { name: 'Lua', icon: LANGUAGES.Lua },
      {
        name: 'Bash',
        icon: () => (currentTheme === 'dark' ? LANGUAGES.BashLight : LANGUAGES.BashDark),
      },
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
      {
        name: 'Prisma',
        icon: () => (currentTheme === 'dark' ? DATABASES.PrismaLight : DATABASES.PrismaDark),
      },
      { name: 'Redis', icon: DATABASES.Redis },
    ],
  };

  return (
    <motion.section
      transition={TRANSITION_SECTION}
      variants={VARIANTS_SECTION}
      className="w-2/3 space-y-8"
      id="stacks"
    >
      {Object.entries(skillsData).map(([category, skills], categoryIndex) => (
        <div key={categoryIndex}>
          <h4 className="mb-4 text-lg font-medium">{t(`stacks.categories.${category}`)}</h4>

          <div className="flex flex-wrap gap-x-1 gap-y-2">
            {skills.map((skill, skillIndex) => (
              <div key={skillIndex}>
                <SkillItem icon={skill.icon} name={skill.name} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.section>
  );
}

export { StacksSection };
