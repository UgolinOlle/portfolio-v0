'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function Demo() {
  return (
    <TooltipProvider delay={300}>
      <div className="flex gap-2">
        {['Save', 'Share', 'Delete'].map((label) => (
          <Tooltip key={label}>
            <TooltipTrigger render={<Button variant="outline" />}>{label}</TooltipTrigger>
            <TooltipContent>{label} this item</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
