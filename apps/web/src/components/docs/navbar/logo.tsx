'use client';

import { m } from 'motion/react';
import Image from 'next/image';

const Logo = () => (
  <m.div
    className="flex items-center gap-2"
    whileTap={{ scale: 0.97 }}
    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
  >
    <Image src="/favicon.ico" alt="" width={24} height={24} className="rounded-sm" />
  </m.div>
);

export { Logo };
