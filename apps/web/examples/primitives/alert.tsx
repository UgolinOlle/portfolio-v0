'use client';

import { InfoIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Demo() {
  return (
    <Alert animated className="w-80">
      <InfoIcon />
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>The `animated` prop makes it rise in on mount.</AlertDescription>
    </Alert>
  );
}
