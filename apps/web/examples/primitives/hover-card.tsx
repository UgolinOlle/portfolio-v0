'use client';

import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

export default function Demo() {
  return (
    <HoverCard>
      <HoverCardTrigger render={<Button variant="link" />}>@ugolin</HoverCardTrigger>
      <HoverCardContent>Full-stack developer. Hover to preview.</HoverCardContent>
    </HoverCard>
  );
}
