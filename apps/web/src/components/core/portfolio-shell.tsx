import type { ReactNode } from 'react';

import { Footer } from '~/components/core/footer';
import { Header } from '~/components/core/header';

type PortfolioShellProps = {
  readonly children: ReactNode;
};

export function PortfolioShell({ children }: PortfolioShellProps) {
  return (
    <div className="group/layout relative mx-auto w-full flex-1 px-4 py-20 pt-24 font-sans lg:max-w-3xl">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
