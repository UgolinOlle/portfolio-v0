'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function Demo() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="airplane" />
      <Label htmlFor="airplane">Airplane mode</Label>
    </div>
  );
}
