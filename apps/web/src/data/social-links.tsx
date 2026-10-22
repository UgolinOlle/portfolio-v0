import { LOGOS } from '~/components/icons';
import type { SocialLink } from '~/types';

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/ugolin-olle',
    icon: LOGOS.LinkedIn,
    preview: {
      kind: 'linkedin',
      name: 'Ugolin Ollé',
      handle: '@ugolin-olle',
      avatar:
        'https://media.licdn.com/dms/image/v2/D4E35AQHfN9OIs0vNcQ/profile-framedphoto-shrink_800_800/B4EZ_WrubXHkAY-/0/1786013214882?e=1787670000&v=beta&t=LDNTeVmDxiqV1pGarls1vdFWNKZv8kptRWEw_v-CCP8',
      role: 'Développeur Full Stack freelance',
      bio: 'Expériences produit, sites vitrines et outils sur-mesure.',
    },
  },
  {
    label: 'Github',
    link: 'https://github.com/UgolinOlle',
    icon: LOGOS.GithubLight,
    iconDark: LOGOS.GithubDark,
    preview: {
      kind: 'github',
      name: 'Ugolin Ollé',
      handle: '@UgolinOlle',
      avatar: 'https://github.com/UgolinOlle.png',
      bio: 'Composants, expérimentations et side-projects open source.',
      stats: [
        { label: 'Repos', value: '20+' },
        { label: 'Followers', value: '15+' },
      ],
    },
  },
  {
    label: 'Malt',
    link: 'https://www.malt.fr/profile/ugolinolle',
    icon: LOGOS.Malt,
    preview: {
      kind: 'malt',
      name: 'Ugolin Ollé',
      avatar:
        'https://dam.malt.com/07c65f24-a1b7-4895-a8af-9a10e1425dc6?gravity=face&func=face&face_margin=70&w=360&h=360&force_format=webp',
      role: 'Développeur Full Stack',
      bio: 'Disponible pour des missions freelance en développement web.',
    },
  },
  {
    label: 'Twitter',
    link: 'https://twitter.com/ugolin_olle',
    icon: LOGOS.XLight,
    iconDark: LOGOS.XDark,
    preview: {
      kind: 'twitter',
      name: 'Ugolin Ollé',
      handle: '@ugolin_olle',
      avatar: 'https://pbs.twimg.com/profile_images/1959181504485150721/7pyz6ZFZ_400x400.jpg',
      bio: "Développeur, partage de builds et d'expérimentations frontend.",
    },
  },
  {
    label: 'NPM',
    link: 'https://www.npmjs.com/~ugolin-olle',
    icon: LOGOS.Npm,
    preview: {
      kind: 'npm',
      name: 'Ugolin Ollé',
      handle: '~ugolin-olle',
      avatar:
        'https://www.npmjs.com/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci9kZDcxOWFkOWIwNTIzZGQzYTA0OTM1NzJlN2ZjNGE5Mj9zaXplPTQ5NiZkZWZhdWx0PXJldHJvIn0.mSd9mX2lhvKr3_0JCRsPoBiRI-ESygnrvT-IaRnQst4',
      bio: 'Building packages & projects.',
    },
  },
];
