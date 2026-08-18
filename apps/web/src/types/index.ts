import type { ComponentType, ReactNode } from 'react';

/**
 * @name Project
 * @description Type for projects
 * @property {string} name - The name of the project
 * @property {string} description - The description of the project
 * @property {string} link - The link to the project
 * @property {string} url - The URL of the project
 * @property {string} id - The unique identifier for the project
 */
export type Project = {
  name: string;
  description: string;
  link: string;
  content?: ReactNode;
  id: string;
};

/**
 * @name Resources
 * @description Type for resources
 * @property {string} name - The name of the resource
 * @property {string} type - The type of the resource
 * @property {string} color - The color of the resource
 * @property {string} url - The URL of the resource
 */
export type Resources = {
  name: string;
  type: string;
  color: string;
  url?: string;
  icon?: ReactNode | ComponentType<{ className?: string }>;
};

/**
 * @name SocialPreviewKind
 * @description Discriminates which layout/copy a SocialPreviewCard should use
 */
export type SocialPreviewKind = 'github' | 'linkedin' | 'malt' | 'twitter' | 'generic';

/**
 * @name SocialPreviewStat
 * @description A single labeled stat shown in a SocialPreviewCard (e.g. "Repos" / "20+")
 */
export type SocialPreviewStat = {
  label: string;
  value: string;
};

/**
 * @name SocialPreview
 * @description Data-driven content rendered inside the hover preview card for a social link
 * @property {SocialPreviewKind} kind - Which preview layout/copy to use
 * @property {string} name - Display name shown in the card
 * @property {string} handle - Username/handle shown under the name
 * @property {string} role - Short role/title line
 * @property {string} bio - Short bio/description line
 * @property {string} avatar - Avatar image URL, falls back to initials when absent
 * @property {SocialPreviewStat[]} stats - Optional row of small stats (followers, repos, ...)
 */
export type SocialPreview = {
  kind: SocialPreviewKind;
  name: string;
  handle?: string;
  role?: string;
  bio?: string;
  avatar?: string;
  stats?: SocialPreviewStat[];
};

/**
 * @name SocialLink
 * @description Type for social links
 * @property {string} label - The label of the social link
 * @property {string} link - The link of the social link
 * @property {SocialPreview} preview - Optional hover preview content (desktop only)
 */
export type SocialLink = {
  label: string;
  link: string;
  favicon?: string;
  icon?: ComponentType<{ className?: string }>;
  iconDark?: ComponentType<{ className?: string }>;
  preview?: SocialPreview;
};

/**
 * @name IconProps
 * @description Type for icon props
 * @property {string} className - The class name of the icon
 */
export type IconProps = {
  className?: string;
};

/**
 * @name ComponentVariant
 * @description Type for component variants
 * @property {string} name - The name of the variant
 * @property {ReactNode} preview - The preview element for the variant
 * @property {string} code - The code for the variant
 */
export type ComponentVariant = {
  name: string;
  preview: ReactNode;
  code?: string;
};

/**
 * @name ComponentProp
 * @description Type for component props documentation
 * @property {string} name - The name of the prop
 * @property {string} type - The type of the prop
 * @property {string} description - The description of the prop
 * @property {string} default - The default value of the prop
 * @property {boolean} required - Whether the prop is required
 */
export type ComponentProp = {
  name: string;
  type: string;
  description: string;
  default?: string;
  required?: boolean;
};

/**
 * @name Component
 * @description Type for components
 * @property {string} name - The name of the component
 * @property {string} slug - The URL slug for the component
 * @property {string} description - The description of the component
 * @property {string} category - The category of the component
 * @property {string[]} tags - Tags associated with the component
 * @property {ReactNode} preview - The preview element for the component
 * @property {string} code - The main component code
 * @property {string} usage - Example usage code
 * @property {boolean} isPremium - Whether the component is premium
 * @property {ComponentType} icon - Icon for the component
 * @property {ComponentVariant[]} variants - Different variants of the component
 * @property {string[]} dependencies - Required dependencies
 * @property {ComponentProp[]} props - Component props documentation
 * @property {string[]} relatedComponents - Related component slugs
 * @property {string} downloadUrl - URL to download the component
 */
export type Component = {
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  preview: ReactNode;
  code: string;
  usage: string;
  isPremium?: boolean;
  icon?: ComponentType<{ className?: string }>;
  variants?: ComponentVariant[];
  dependencies?: string[];
  props?: ComponentProp[];
  relatedComponents?: string[];
  downloadUrl?: string;
};

/**
 * @name WorkExperience
 * @description Type for works experiences
 * @property {string} company - The company name
 * @property {string} title - The title of experience
 * @property {start} string - Date start
 * @property {end} string - Date end
 * @property {logo} string - Logo of the experience
 * @property {link} string - Link of the experience
 * @property {id} string - ID of the experience
 */
export type WorkExperience = {
  company: string;
  title: string;
  start: string;
  end?: string;
  logo?: string;
  link: string;
  id: string;
};
