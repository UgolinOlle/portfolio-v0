'use client';

import { Button } from '@/components/ui/button';

export default function Demo() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  );
}
