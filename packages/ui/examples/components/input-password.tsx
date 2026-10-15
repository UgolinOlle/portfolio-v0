'use client';

import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';
import { Input } from 'registry/components/core/input/input';

export default function Demo() {
  const [value, setValue] = useState('');
  const [visible, setVisible] = useState(false);

  return (
    <Input
      type={visible ? 'text' : 'password'}
      placeholder="Password"
      leftIcon={<Lock className="size-4" />}
      rightIcon={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="text-muted-foreground transition hover:text-foreground"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      }
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
