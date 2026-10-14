import { siteConfig } from '~/lib/metadata';

export const WEBSITE_URL = siteConfig.url;
export const EMAIL = siteConfig.email;

// The container only staggers its children: fading it would hide the whole page until hydration.
export const VARIANTS_CONTAINER = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

export const TRANSITION_SECTION = {
  duration: 0.3,
};
