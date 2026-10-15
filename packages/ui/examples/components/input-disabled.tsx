'use client';

import { Input } from 'registry/components/core/input/input';

export default function Demo() {
  return (
    <Input disabled onChange={() => {}} placeholder="Disabled input" value="Can't edit this" />
  );
}
