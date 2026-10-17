'use client';

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

export default function Demo() {
  return (
    <InputOTP maxLength={4}>
      <InputOTPGroup>
        {[0, 1, 2, 3].map((index) => (
          <InputOTPSlot index={index} key={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
