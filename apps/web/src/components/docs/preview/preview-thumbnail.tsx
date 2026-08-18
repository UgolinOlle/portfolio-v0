import { cn } from '@portfolio-v0/shadcn/utils';

// Largeur virtuelle utilisée pour restituer une mise en page "desktop" avant de la réduire.
const VIRTUAL_WIDTH = 1280;
const THUMBNAIL_SCALE = 0.28;

type PreviewThumbnailProps = {
  // Nom du fichier dans `apps/web/examples/` (sans extension), ex. "blog".
  path: string;
  type?: 'component' | 'block' | 'template';
  className?: string;
};

// Miniature statique et non interactive d'un exemple, utilisée dans les grilles de cards.
export const PreviewThumbnail = async ({
  path,
  type = 'component',
  className,
}: PreviewThumbnailProps) => {
  const Component = await (
    type === 'component'
      ? import(`../../../../examples/components/${path}.tsx`)
      : import(`../../../../examples/${path}.tsx`)
  )
    .then((module) => module.default)
    .catch(() => undefined);

  if (!Component) {
    return null;
  }

  const isFullPage = type !== 'component';

  return (
    <div className={cn('relative size-full overflow-hidden bg-muted/20', className)}>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {isFullPage ? (
          <div
            style={{
              width: VIRTUAL_WIDTH,
              transform: `scale(${THUMBNAIL_SCALE})`,
            }}
          >
            <Component />
          </div>
        ) : (
          <Component />
        )}
      </div>
    </div>
  );
};
