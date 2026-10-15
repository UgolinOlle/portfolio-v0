'use client';

import { useState } from 'react';
import { Input } from 'registry/components/core/input/input';

export default function Demo() {
  const [value, setValue] = useState('');

  return (
    <Input placeholder="Enter your name" value={value} onChange={(e) => setValue(e.target.value)} />
  );
}
