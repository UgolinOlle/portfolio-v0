'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { m } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { useTranslation } from '~/components/core/i18n-provider';
import { CheckIcon, CopyIcon } from '~/components/icons/ui';
import { MagneticSocialLink } from '~/components/ui';
import {
  EMAIL,
  SECTION_REVEAL_LIST,
  TRANSITION_SECTION,
  VARIANTS_LIST,
  VARIANTS_SECTION,
} from '~/lib/constants';
import { SOCIAL_LINKS } from '~/lib/data';

import { SectionHeading } from './section-heading';

const COPIED_RESET_MS = 2000;

/** Fallback for browsers or contexts where the async Clipboard API is blocked. */
function copyWithSelection(text: string) {
  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.append(field);
  field.select();
  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    field.remove();
  }
}

/** The email is the main call to action: big, copyable, with in-place confirmation. */
function EmailAction() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(EMAIL);
      ok = true;
    } catch {
      ok = copyWithSelection(EMAIL);
    }
    setStatus(ok ? 'copied' : 'failed');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), COPIED_RESET_MS);
  };
  const copied = status === 'copied';

  const focusRing =
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none';

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <button
        className={cn(
          'group inline-flex items-center gap-2 rounded-lg text-xl font-medium tracking-tight',
          'text-zinc-950 transition-transform duration-150 active:scale-[0.98] dark:text-zinc-50',
          focusRing,
        )}
        onClick={copy}
        type="button"
      >
        <span className="underline decoration-zinc-300 underline-offset-4 transition-colors duration-200 group-hover:decoration-current dark:decoration-zinc-700">
          {EMAIL}
        </span>
        {copied ? (
          <CheckIcon aria-hidden="true" className="size-4 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <CopyIcon aria-hidden="true" className="size-4 text-zinc-400" />
        )}
        <span className="sr-only">{t('contact.copy')}</span>
      </button>

      <a
        className={cn(
          'rounded text-sm text-zinc-600 underline-offset-4 transition-colors duration-200 hover:text-zinc-950 hover:underline',
          'dark:text-zinc-400 dark:hover:text-zinc-50',
          focusRing,
        )}
        href={`mailto:${EMAIL}`}
      >
        {t('contact.write')}
      </a>

      <span
        aria-live="polite"
        className="text-sm text-emerald-700 dark:text-emerald-400"
        role="status"
      >
        {status === 'copied' && t('contact.copied')}
        {status === 'failed' && t('contact.copyFailed')}
      </span>
    </div>
  );
}

function ContactSection() {
  const { t } = useTranslation();

  return (
    <m.section {...SECTION_REVEAL_LIST} className="space-y-6" id="contact">
      <SectionHeading>{t('contact.title')}</SectionHeading>

      <p className="text-sm text-zinc-600 dark:text-zinc-300">{t('contact.description')}</p>

      <EmailAction />

      <m.div
        className="flex flex-wrap items-center justify-start gap-x-3 gap-y-2"
        variants={VARIANTS_LIST}
      >
        {SOCIAL_LINKS.map((link) => (
          <m.div key={link.label} transition={TRANSITION_SECTION} variants={VARIANTS_SECTION}>
            <MagneticSocialLink link={link.link}>{link.label}</MagneticSocialLink>
          </m.div>
        ))}
      </m.div>
    </m.section>
  );
}

export { ContactSection };
