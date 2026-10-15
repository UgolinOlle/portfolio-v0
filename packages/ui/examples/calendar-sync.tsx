'use client';

import { CalendarSync } from '@/components/blocks/calendar-sync/calendar-sync';

export default function CalendarSyncExample() {
  return <CalendarSync syncDuration={2000} onSync={() => console.log('Sync started')} />;
}
