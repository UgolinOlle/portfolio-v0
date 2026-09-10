import type { ReactNode } from 'react';

type UiLayoutProps = {
  readonly children: ReactNode;
};

export default function UiLayout({ children }: UiLayoutProps) {
  return <div className="flex w-full flex-1 flex-col">{children}</div>;
}
