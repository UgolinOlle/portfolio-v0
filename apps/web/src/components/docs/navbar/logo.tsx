'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export const Logo = () => (
  <motion.div
    className="flex items-center gap-2"
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
  >
    <Image src="/favicon.ico" alt="Whoa UI Logo" width={32} height={32} className="rounded-md" />
  </motion.div>
);
