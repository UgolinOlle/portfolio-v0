import { cn } from '@/lib/utils';

type HeaderProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  children: React.ReactNode;
};

const styles = {
  h1: 'scroll-m-20 text-5xl font-bold tracking-tight lg:text-6xl',
  h2: 'scroll-m-20 border-b pb-2 text-4xl font-semibold tracking-tight first:mt-0',
  h3: 'scroll-m-20 text-3xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h5: 'scroll-m-20 text-xl font-semibold tracking-tight',
  h6: 'scroll-m-20 text-lg font-semibold tracking-tight text-muted-foreground',
} satisfies Record<NonNullable<HeaderProps['as']>, string>;

export function Header({ as: Component = 'h1', className, children }: HeaderProps) {
  return <Component className={cn(styles[Component], className)}>{children}</Component>;
}
