'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from 'registry/components/core/input/input';

export default function Demo() {
  const [value, setValue] = useState('');

  return (
    <Input
      placeholder="Search..."
      leftIcon={<Search className="size-4" />}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      clearable
    />
  );
}
