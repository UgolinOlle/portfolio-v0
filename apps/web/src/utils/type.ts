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
 * @name SocialLink
 * @description Type for social links
 * @property {string} label - The label of the social link
 * @property {string} link - The link of the social link
 */
export type SocialLink = {
  label: string;
  link: string;
  favicon?: string;
  icon?: React.ComponentType<{ className?: string }>;
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
