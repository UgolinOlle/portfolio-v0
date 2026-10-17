'use client';

import { InboxIcon } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export default function Demo() {
  return (
    <Empty animated className="w-80 border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <InboxIcon />
        </EmptyMedia>
        <EmptyTitle>No messages</EmptyTitle>
        <EmptyDescription>New messages will show up here.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
