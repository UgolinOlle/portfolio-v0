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
      {/* Works and About read as one story: keep them closer than the other sections. */}
      <div className="space-y-16">
        <WorksSection />
        <AboutSection />
      </div>
      {recentWritings}
      <StacksSection />
      <ContactSection />
    </div>
  );
}
