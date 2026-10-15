'use client';

import { Lock } from 'lucide-react';
import { useState } from 'react';
import { Input } from 'registry/components/core/input/input';

export default function Demo() {
  const [password, setPassword] = useState('');

  const status = password.length === 0 ? 'idle' : password === '123456' ? 'success' : 'error';

  return (
    <Input
      type="password"
      placeholder="Password"
      leftIcon={<Lock className="size-4" />}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      status={status}
      errorMessage="Password must be 123456"
      clearable
    />
  );
}
