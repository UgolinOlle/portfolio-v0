'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { useTranslation } from '~/components/core/i18n-provider';
import { EMAIL } from '~/lib/constants';

type ConstructionBannerProps = {
  readonly className?: string;
};

function ConstructionBanner({ className }: ConstructionBannerProps) {
  const { t } = useTranslation();

  return (
    <p
      className={cn(
        'not-prose flex flex-col gap-1.5 border border-foreground/10 px-3.5 py-3 text-sm text-foreground/65',
        className,
      )}
      role="status"
    >
      <span className="label-mono flex items-center gap-2 text-foreground">
        <span aria-hidden="true" className="size-1.5 bg-amber-500" />
        Beta
      </span>
      <span className="text-pretty">
        {t('registry.construction')}{' '}
        <a
          className="font-medium text-foreground underline underline-offset-2 hover:decoration-2"
          href={`mailto:${EMAIL}`}
        >
          {EMAIL}
        </a>
        .
      </span>
    </p>
  );
}

export { ConstructionBanner };
