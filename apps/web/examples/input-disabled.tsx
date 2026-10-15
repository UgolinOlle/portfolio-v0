'use client';

import { Input } from '@/components/ui/ugolin/input';

export default function Demo() {
  return (
    <Input disabled onChange={() => {}} placeholder="Disabled input" value="Can't edit this" />
  );
}
