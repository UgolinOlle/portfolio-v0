'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { m } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { WORKS_EXPERIENCES } from '~/data/works';
import { SECTION_REVEAL_LIST, TRANSITION_SECTION, VARIANTS_SECTION } from '~/lib/constants';

import { useTranslation } from '../core/i18n-provider';

import { SectionHeading } from './section-heading';

type CompanyLogoProps = {
  company: string;
  logo?: string;
};

/** Company logo, with the initial as a fallback when there is none or the remote favicon fails. */
function CompanyLogo({ company, logo }: CompanyLogoProps) {
  const [failed, setFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // An image that already failed before hydration never fires onError: catch it on mount.
  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth === 0) {
      setFailed(true);
    }
  }, []);

  const showLogo = Boolean(logo) && !failed;

  return (
    <div
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-lg border',
        showLogo
          ? 'bg-white dark:bg-zinc-900'
          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
      )}
    >
      {showLogo ? (
        // Decorative: the company name is the heading right next to it.
        <img
          alt=""
          className="size-5 rounded object-contain"
          decoding="async"
          height={20}
          loading="lazy"
          onError={() => setFailed(true)}
          ref={imageRef}
          src={logo}
          width={20}
        />
      ) : (
        <span aria-hidden="true" className="text-xs font-semibold">
          {company.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function WorksSection() {
  const { t } = useTranslation();

  return (
    <m.section {...SECTION_REVEAL_LIST} id="works">
      <SectionHeading>{t('sections.works')}</SectionHeading>

      <ul className="flex flex-col">
        {WORKS_EXPERIENCES.map((job) => (
          <m.li
            transition={TRANSITION_SECTION}
            variants={VARIANTS_SECTION}
            className="-mx-3 flex items-start justify-between gap-4 rounded-xl px-3 py-3 text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
            key={job.id}
          >
            <div className="flex min-w-0 items-start gap-3">
              <CompanyLogo company={job.company} logo={job.logo} />

              <div className="flex min-w-0 flex-col">
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{job.company}</h3>
                <p className="text-zinc-500 dark:text-zinc-400">{job.title}</p>
              </div>
            </div>

            <p className="shrink-0 text-zinc-500 tabular-nums dark:text-zinc-400">
              {job.start} {job.end && `– ${job.end}`}
            </p>
          </m.li>
        ))}
      </ul>
    </m.section>
  );
}

export { WorksSection };
