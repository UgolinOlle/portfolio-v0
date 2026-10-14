'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

const Logo = () => (
  <motion.div
    className="flex items-center gap-2"
    whileTap={{ scale: 0.97 }}
    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
  >
    <Image src="/favicon.ico" alt="" width={24} height={24} className="rounded-sm" />
  </motion.div>
);

export { Logo };
