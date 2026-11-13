import type { ReactNode } from 'react';

import { AboutSection, HeroSection } from './about-section';
import { HomeToc } from './home-toc';
import { ProjectsLoader } from './projects-loader';
import { StacksSection } from './stacks-section';
import { WorksSection } from './works-section';

type HomeContentProps = {
  recentWritings: ReactNode;
};

export function HomeContent({ recentWritings }: HomeContentProps) {
  return (
    <HomeToc>
      <div className="space-y-28">
        <HeroSection />
        <ProjectsLoader />
        {/* Works and About read as one story: keep them closer than the other sections. */}
        <div className="space-y-20">
          <WorksSection />
          <AboutSection />
        </div>
        {recentWritings}
        <StacksSection />
      </div>
    </HomeToc>
  );
}
