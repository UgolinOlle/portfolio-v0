import { cn } from '@portfolio-v0/shadcn/utils';

// Largeur virtuelle par défaut : une mise en page "desktop" complète, réduite ensuite.
const DEFAULT_VIRTUAL_WIDTH = 1280;
// Largeur affichée de la miniature : la réduction est calculée depuis la largeur de conception.
const THUMBNAIL_WIDTH = 358;

type PreviewThumbnailProps = {
  // Nom du fichier dans `apps/web/examples/` (sans extension), ex. "blog".
  path: string;
  type?: 'component' | 'block' | 'template';
  // Largeur de conception du block (frontmatter `previewWidth`) : un widget compact est moins réduit.
  virtualWidth?: number;
  className?: string;
};

// Miniature statique et non interactive d'un exemple, utilisée dans les grilles de cards.
export const PreviewThumbnail = async ({
  path,
  type = 'component',
  virtualWidth = DEFAULT_VIRTUAL_WIDTH,
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
      <div className="pointer-events-none absolute inset-0 flex min-w-0 items-center justify-center overflow-hidden">
        {isFullPage ? (
          <div
            style={{
              width: virtualWidth,
              transform: `scale(${THUMBNAIL_WIDTH / virtualWidth})`,
            }}
          >
            <Component />
          </div>
        ) : (
          <div className="w-full max-w-full min-w-0 [zoom:0.7] max-sm:[zoom:0.5] [&>*]:w-full [&>*]:max-w-full [&>*]:min-w-0">
            <Component />
          </div>
        )}
      </div>
    </div>
  );
};
