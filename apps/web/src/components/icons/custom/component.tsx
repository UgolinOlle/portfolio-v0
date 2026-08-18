import type { IconProps } from '~/types';

type ComponentIconProps = IconProps & {
  /** Soft currentColor fill tint on the module, for active/selected nav state. */
  active?: boolean;
};

/**
 * Signature Whoa UI icon — a single module with selection handles at each
 * corner, evoking one selected UI element. Anchors the icon "grammar" that
 * Block (grouped modules) and Template (module inside a page frame) build on.
 */
export const ComponentIcon = ({ className, active = false }: ComponentIconProps) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <title>Component</title>
    <rect
      fill="currentColor"
      fillOpacity={active ? 0.16 : 0}
      height="10"
      rx="2.25"
      stroke="currentColor"
      strokeWidth="1.75"
      width="10"
      x="7"
      y="7"
    />
    <path
      d="M4 7V4.5C4 4.22386 4.22386 4 4.5 4H7M17 4H19.5C19.7761 4 20 4.22386 20 4.5V7M20 17V19.5C20 19.7761 19.7761 20 19.5 20H17M7 20H4.5C4.22386 20 4 19.7761 4 19.5V17"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
    />
  </svg>
);
