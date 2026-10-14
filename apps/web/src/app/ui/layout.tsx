import { TranslationProvider } from '@fuma-translate/react';
import type { ReactNode } from 'react';

import { registryTranslations } from '~/lib/registry-translations';

type UiLayoutProps = {
  readonly children: ReactNode;
};

export default function UiLayout({ children }: UiLayoutProps) {
  return (
    <TranslationProvider translations={registryTranslations}>
      <div className="flex w-full flex-1 flex-col">{children}</div>
    </TranslationProvider>
  );
}
