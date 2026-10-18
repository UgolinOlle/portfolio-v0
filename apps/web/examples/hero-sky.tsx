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
        <>
          Where your <HeroSkyCloud /> dream
        </>,
        'designs come true',
      ]}
    />
  );
}
