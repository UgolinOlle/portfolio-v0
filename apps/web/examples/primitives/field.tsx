'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function Demo() {
  const [email, setEmail] = useState('');
  const invalid = email.length > 0 && !email.includes('@');

  return (
    <Field className="w-72" data-invalid={invalid}>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input
        aria-invalid={invalid}
        id="email"
        onChange={(event) => setEmail(event.target.value)}
        value={email}
      />
      <FieldDescription>Type something without an @ to see the error collapse in.</FieldDescription>
      <FieldError>{invalid ? 'Enter a valid email address.' : null}</FieldError>
      <Button onClick={() => setEmail('')} size="sm" variant="outline">
        Reset
      </Button>
    </Field>
  );
}
