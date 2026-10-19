import { Fragment } from 'react';

import { HeroSky, HeroSkyCloud } from '@/components/blocks/hero-sky';

export default function HeroSkyExample() {
  return (
    <HeroSky
      action={{ label: 'Book a call', href: '#contact' }}
      badge="EST 2026"
      brand="DayDream"
      description="We turn floating ideas into thoughtful, beautiful designs that feel like a dream."
      links={[
        { label: 'See our work', href: '#work' },
        { label: 'Book a call', href: '#contact' },
      ]}
      title={[
        <Fragment key="line-1">
          Where your <HeroSkyCloud /> dream
        </Fragment>,
        'designs come true',
      ]}
    />
  );
}
