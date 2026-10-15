'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { Network, Radar, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
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
  SiWireshark,
} from 'react-icons/si';

import { useTranslation } from '~/components/core/i18n-provider';
import { DATABASES, FRAMEWORKS, LANGUAGES, TOOLS } from '~/components/icons';
import { TRANSITION_SECTION, VARIANTS_SECTION } from '~/lib/constants';

import { SectionHeading } from './section-heading';

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
const LaravelLogo = brandLogo(SiLaravel, '#FF2D20');
// MySQL's brand blue disappears on the dark background, so dark mode gets a lighter tint.
const MysqlLogo = themedLogo(brandLogo(SiMysql, '#4479A1'), brandLogo(SiMysql, '#5FA8D3'));
const GitLogo = brandLogo(SiGit, '#F05032');
const GithubActionsLogo = brandLogo(SiGithubactions, '#2088FF');
const GrafanaLogo = brandLogo(SiGrafana, '#F46800');
const PrometheusLogo = brandLogo(SiPrometheus, '#E6522C');
const WiresharkLogo = brandLogo(SiWireshark, '#1679A7');
// Simple Icons has no Nmap logo, so it uses the closest Lucide glyph in the brand color.
const NmapLogo = brandLogo(Radar, '#4F9FD8');

type Skill = { name: string; labelKey?: string; icon: SkillItemProps['icon'] };

// Grouped to mirror the CV: dev stack first, then the systems & networks side of the profile.
const SKILLS: Record<string, Skill[]> = {
  languages: [
    { name: 'TypeScript', icon: LANGUAGES.Typescript },
    { name: 'JavaScript', icon: LANGUAGES.Javascript },
    { name: 'PHP', icon: PhpLogo },
    { name: 'Python', icon: PythonLogo },
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
  systems: [
    { name: 'Linux', icon: TOOLS.Linux },
    { name: 'Networking', labelKey: 'stacks.networking', icon: Network },
    { name: 'Cybersecurity', labelKey: 'stacks.cybersecurity', icon: ShieldCheck },
    { name: 'Wireshark', icon: WiresharkLogo },
    { name: 'Nmap', icon: NmapLogo },
  ],
  tools: [
    { name: 'Git', icon: GitLogo },
    { name: 'GitHub', icon: TOOLS.GitHub },
    { name: 'Neovim', icon: TOOLS.Neovim },
    { name: 'VSCode', icon: TOOLS.VSCode },
    { name: 'Bun', icon: TOOLS.Bun },
    { name: 'Figma', icon: TOOLS.Figma },
    { name: 'Claude', icon: TOOLS.Anthropic },
  ],
};

function StacksSection() {
  const { t } = useTranslation();

  return (
    <motion.section
      transition={TRANSITION_SECTION}
      variants={VARIANTS_SECTION}
      className="space-y-8"
      id="stacks"
    >
      <SectionHeading>{t('sections.stacks')}</SectionHeading>

      {Object.entries(SKILLS).map(([category, skills]) => (
        <div key={category}>
          <h3 className="mb-4 text-lg font-medium">{t(`stacks.categories.${category}`)}</h3>

          <div className="flex flex-wrap gap-x-1 gap-y-2">
            {skills.map((skill) => (
              <div key={skill.name}>
                <SkillItem
                  icon={skill.icon}
                  name={skill.labelKey ? t(skill.labelKey) : skill.name}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.section>
  );
}

export { StacksSection };
