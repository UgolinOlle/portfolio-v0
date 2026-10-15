'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/ugolin/input';

export default function Demo() {
  const [value, setValue] = useState('Searching…');

  return (
    <Input
      loading
      onChange={(e) => setValue(e.target.value)}
      placeholder="Loading..."
      value={value}
    />
  );
}
