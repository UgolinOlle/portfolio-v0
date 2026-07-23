import { Button } from '@/components/ui/button';

export function CtaSimple() {
  return (
    <section className="flex flex-col items-center gap-6 py-24 text-center">
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ready to get started?</h2>
      <p className="max-w-md text-muted-foreground">
        Join thousands of teams already building with our platform.
      </p>
      <div className="flex gap-3">
        <Button size="lg">Get started</Button>
        <Button size="lg" variant="outline">
          Learn more
        </Button>
      </div>
    </section>
  );
}
