'use client';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function Demo() {
  return (
    <Collapsible className="w-72">
      <CollapsibleTrigger render={<Button variant="outline" />}>Toggle details</CollapsibleTrigger>
      <CollapsibleContent>
        <p className="pt-3 text-sm text-muted-foreground">
          Height and opacity transition together, and reversing mid-way retargets smoothly.
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
}
