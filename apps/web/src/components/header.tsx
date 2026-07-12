'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

import { useTranslation } from '~/components/i18n/i18n-provider';
import { LOGOS } from '~/components/icons';
import { TextEffect, TextHoverEnter } from '~/components/ui';
import { SOCIAL_LINKS } from '~/lib/data';
import { cn } from '~/lib/utils';
import type { SocialLink } from '~/utils/type';

function SocialLinkIcon({
  link,
  currentTheme,
}: {
  link: SocialLink;
  currentTheme: string | undefined;
}) {
  if (link.label === 'Twitter' && link.icon) {
    const IconComponent = currentTheme === 'dark' ? LOGOS.XDark : LOGOS.XLight;
    return <IconComponent className="h-4 w-4" />;
  }

  if (link.label === 'Github' && link.icon) {
    const IconComponent = currentTheme === 'dark' ? LOGOS.GithubDark : LOGOS.GithubLight;
    return <IconComponent className="h-4 w-4" />;
  }

  if (link.favicon) {
    return (
      <Image
        alt={`${link.label} icon`}
        className="h-4 w-4"
        height={16}
        loading="lazy"
        src={link.favicon}
        width={16}
      />
    );
  }

  if (link.icon) {
    const IconComponent = link.icon;
    return <IconComponent className="h-4 w-4" />;
  }

  return null;
}

function Header() {
  const { t } = useTranslation();
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;

  return (
    <header className="mb-14 flex flex-col items-start justify-between gap-4 sm:items-center sm:gap-6">
      <div className="flex w-full flex-col items-start gap-2">
        <div>
          <Link className="text-xl text-black dark:text-white" href="/">
            Ugolin Ollé
          </Link>
          <TextEffect
            as="p"
            className="font-sans font-normal text-primary"
            delay={0.5}
            per="char"
            preset="fade"
          >
            {t('header.title')}
          </TextEffect>
        </div>

        <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />

        <div className="my-1 grid w-fit grid-cols-2 gap-x-4 gap-y-2 md:flex md:flex-row md:items-center md:gap-3">
          {SOCIAL_LINKS.map((link) => (
            <Link
              className={cn(
                'group flex w-fit items-center gap-2 rounded-sm px-2 py-1 text-primary/80',
                'border border-primary/20 transition-all duration-300 hover:bg-primary-foreground',
                'active:scale-[0.95]',
              )}
              key={link.label}
              rel="noopener noreferrer"
              target="_blank"
              href={link.link}
            >
              <SocialLinkIcon currentTheme={currentTheme} link={link} />
              <TextHoverEnter className="text-sm">{link.label}</TextHoverEnter>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

export { Header };
