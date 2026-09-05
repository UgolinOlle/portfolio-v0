'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

type BackButtonProps = {
  href?: string;
  title?: string;
};

function BackButton({ href = '/', title = 'Home' }: BackButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground"
    >
      <Link
        href={href}
        className="transition-opacity hover:opacity-60"
        aria-label="Retour à l'accueil"
      >
        ← {title}
      </Link>
    </motion.div>
  );
}

export { BackButton };
