import type { IconProps } from '~/types';

type BlockIconProps = IconProps & {
  /** Soft currentColor fill tint on each module, for active/selected nav state. */
  active?: boolean;
};

/**
 * Signature Whoa UI icon — an asymmetric bento of modules, showing several
 * of the Component unit assembled together. Sibling to ComponentIcon and
 * TemplateIcon; keep the same module corner radius across all three.
 */
export const BlockIcon = ({ className, active = false }: BlockIconProps) => {
  const fillOpacity = active ? 0.16 : 0;

  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>Block</title>
      <rect
        fill="currentColor"
        fillOpacity={fillOpacity}
        height="8"
        rx="1.75"
        stroke="currentColor"
        strokeWidth="1.75"
        width="8"
        x="3"
        y="3"
      />
      <rect
        fill="currentColor"
        fillOpacity={fillOpacity}
        height="4"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.75"
        width="8"
        x="13"
        y="3"
      />
      <rect
        fill="currentColor"
        fillOpacity={fillOpacity}
        height="4"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.75"
        width="8"
        x="13"
        y="9"
      />
      <rect
        fill="currentColor"
        fillOpacity={fillOpacity}
        height="8"
        rx="1.75"
        stroke="currentColor"
        strokeWidth="1.75"
        width="18"
        x="3"
        y="13"
      />
    </svg>
  );
};
