'use client';

import { motion } from 'motion/react';

import {
  AboutSection,
  ContactSection,
  ProjectsSection,
  ResourcesSection,
  StacksSection,
  WorksSection,
} from '~/components/sections';
import { VARIANTS_CONTAINER } from '~/lib/constants';

export default function Home() {
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
      <StacksSection />
      <ResourcesSection />
      <ContactSection />
    </motion.main>
  );
}
