'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Progress, ProgressIndicator, ProgressTrack } from '@/components/ui/progress';

export default function Demo() {
  const [value, setValue] = useState(30);

  return (
    <div className="flex w-72 flex-col items-center gap-4">
      <Progress value={value}>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
      <Button
        onClick={() => setValue((current) => (current >= 100 ? 0 : current + 25))}
        size="sm"
        variant="outline"
      >
        Advance
      </Button>
    </div>
  );
}
