import { PortfolioShell } from '~/components/core/portfolio-shell';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <PortfolioShell>{children}</PortfolioShell>;
}
