import type { IconProps } from '~/types';

type TemplateIconProps = IconProps & {
  /** Soft currentColor fill tint on the content modules, for active/selected nav state. */
  active?: boolean;
};

/**
 * Signature Whoa UI icon — a page frame with a header strip and two content
 * modules, i.e. Component units composed inside a full layout. Completes the
 * Component → Block → Template zoom-out shared with ComponentIcon/BlockIcon.
 */
export const TemplateIcon = ({ className, active = false }: TemplateIconProps) => {
  const fillOpacity = active ? 0.16 : 0;

  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>Template</title>
      <rect height="18" rx="2.25" stroke="currentColor" strokeWidth="1.75" width="18" x="3" y="3" />
      <path d="M3 8.5H21" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
      <rect
        fill="currentColor"
        fillOpacity={fillOpacity}
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.75"
        width="6"
        x="5.5"
        y="11"
      />
      <rect
        fill="currentColor"
        fillOpacity={fillOpacity}
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.75"
        width="6"
        x="13.5"
        y="11"
      />
    </svg>
  );
};
