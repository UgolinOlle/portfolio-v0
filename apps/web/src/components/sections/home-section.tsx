'use client';

import type { ReactNode } from 'react';

import {
  AboutSection,
  ContactSection,
  HeroSection,
  ProjectsSection,
  StacksSection,
  WorksSection,
} from '~/components/sections';

type HomeContentProps = {
  recentWritings: ReactNode;
};

export function HomeContent({ recentWritings }: HomeContentProps) {
  return (
    <div className="space-y-24">
      <HeroSection />
      <ProjectsSection />
      <WorksSection />
      <AboutSection />
      {recentWritings}
      <StacksSection />
      <ContactSection />
    </div>
  );
}
