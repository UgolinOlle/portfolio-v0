'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function Demo() {
  return (
    <RadioGroup defaultValue="comfortable">
      {['default', 'comfortable', 'compact'].map((value) => (
        <div className="flex items-center gap-2" key={value}>
          <RadioGroupItem id={value} value={value} />
          <Label className="capitalize" htmlFor={value}>
            {value}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
