'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

import { INSPIRATIONS } from '~/lib/data';

export function InspirationsContent() {
  return (
    <section className="flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground"
      >
        <Link
          href="/"
          className="transition-opacity hover:opacity-60"
          aria-label="Retour à l'accueil"
        >
          ← Home
        </Link>
      </motion.div>

      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <h1 className="text-3xl font-semibold tracking-tight">Inspirations</h1>

        <p className="mt-4 leading-7 text-muted-foreground">
          Ce projet est construit grâce à de nombreuses <strong>inspirations</strong>, qu'elles
          soient visuelles, techniques ou liées aux interactions.
        </p>
      </motion.header>

      <div className="mt-16 space-y-10">
        {INSPIRATIONS.map((item, index) => (
          <motion.article
            key={item.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.15 + index * 0.08,
            }}
          >
            <Link
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              {item.name}
            </Link>

            <p className="mt-2 text-muted-foreground">{item.description}</p>
          </motion.article>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-20 text-sm leading-7 text-muted-foreground"
      >
        Si une inspiration n'est pas mentionnée ici alors qu'elle devrait l'être,{' '}
        <strong>n'hésitez pas à me contacter</strong>.
      </motion.p>
    </section>
  );
}
