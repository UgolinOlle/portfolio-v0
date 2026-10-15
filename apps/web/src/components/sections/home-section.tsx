'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import {
  AboutSection,
  ContactSection,
  HeroSection,
  ProjectsSection,
  StacksSection,
  WorksSection,
} from '~/components/sections';
import { VARIANTS_CONTAINER } from '~/lib/constants';

type HomeContentProps = {
  recentWritings: ReactNode;
};

export function HomeContent({ recentWritings }: HomeContentProps) {
  return (
    <motion.div
      className="space-y-24"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <HeroSection />
      <ProjectsSection />
      <WorksSection />
      <AboutSection />
      {recentWritings}
      <StacksSection />
      <ContactSection />
    </motion.div>
  );
}
