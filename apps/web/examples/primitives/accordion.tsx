'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function Demo() {
  return (
    <Accordion className="w-80" defaultValue={['one']}>
      <AccordionItem value="one">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It follows the WAI-ARIA pattern.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>Yes, with an interruptible height transition.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
