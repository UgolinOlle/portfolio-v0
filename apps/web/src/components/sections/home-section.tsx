import type { ReactNode } from 'react';

import { AboutSection, HeroSection } from './about-section';
import { ContactSection } from './contact-section';
import { ProjectsSection } from './projects-section';
import { StacksSection } from './stacks-section';
import { WorksSection } from './works-section';

type HomeContentProps = {
  recentWritings: ReactNode;
};

export function HomeContent({ recentWritings }: HomeContentProps) {
  return (
    <div className="space-y-28">
      <HeroSection />
      <ProjectsSection />
      {/* Works and About read as one story: keep them closer than the other sections. */}
      <div className="space-y-20">
        <WorksSection />
        <AboutSection />
      </div>
      {recentWritings}
      <StacksSection />
      <ContactSection />
    </div>
  );
}
