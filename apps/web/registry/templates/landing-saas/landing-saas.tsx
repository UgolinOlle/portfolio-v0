import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FEATURES = [
  { title: 'Fast', description: 'Ship features in minutes, not weeks.' },
  { title: 'Secure', description: 'Enterprise-grade security by default.' },
  { title: 'Scalable', description: 'Grows with your product, painlessly.' },
];

export function LandingSaas() {
  return (
    <div className="flex flex-col">
      <section className="flex flex-col items-center gap-6 py-24 text-center">
        <Badge variant="secondary">New</Badge>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Build your product faster
        </h1>
        <p className="max-w-xl text-muted-foreground">
          The all-in-one platform to design, ship and scale your SaaS.
        </p>
        <div className="flex gap-3">
          <Button size="lg">Start for free</Button>
          <Button size="lg" variant="outline">
            View demo
          </Button>
        </div>
      </section>

      <section className="grid gap-6 py-16 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {feature.description}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
