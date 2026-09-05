'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import {
  AboutSection,
  ContactSection,
  ProjectsSection,
  ResourcesSection,
  StacksSection,
  WorksSection,
} from '~/components/sections';
import { VARIANTS_CONTAINER } from '~/lib/constants';

type HomeContentProps = {
  recentWritings: ReactNode;
};

export function HomeContent({ recentWritings }: HomeContentProps) {
  return (
    <motion.main
      className="space-y-20"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <AboutSection />
      <WorksSection />
      <ProjectsSection />
      {recentWritings}
      <StacksSection />
      <ResourcesSection />
      <ContactSection />
    </motion.main>
  );
}
