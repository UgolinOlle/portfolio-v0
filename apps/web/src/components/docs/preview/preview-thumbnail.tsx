import { cn } from '@portfolio-v0/shadcn/utils';

import { ScaledFrame } from './scaled-frame';

// Largeurs virtuelles de rendu par défaut avant réduction : une page entière en "desktop", un
// block à la largeur d'une colonne de contenu.
const TEMPLATE_VIRTUAL_WIDTH = 1280;
const BLOCK_VIRTUAL_WIDTH = 800;

type PreviewThumbnailProps = {
  // Nom du fichier dans `apps/web/examples/` (sans extension), ex. "blog".
  path: string;
  type?: 'component' | 'block' | 'template';
  // Largeur de conception du block (frontmatter `previewWidth`) : un widget compact est moins réduit.
  virtualWidth?: number;
  // `fill` (frontmatter `previewFit`) : la démo remplit tout le cadre ; `fluid` : le block se dimensionne
  // sur son parent et doit être rendu à `virtualWidth`.
  fit?: 'frame' | 'fill';
  fluid?: boolean;
  // Card "featured" sur deux colonnes. Rien à calculer ici : `ScaledFrame` mesure la largeur
  // réelle de la card, l'échelle suit donc automatiquement.
  wide?: boolean;
  className?: string;
};

// Miniature statique et non interactive d'un exemple, utilisée dans les grilles de cards.
export const PreviewThumbnail = async ({
  path,
  type = 'component',
  virtualWidth,
  fit,
  fluid,
  className,
}: PreviewThumbnailProps) => {
  const Component = await import(`../../../../examples/${path}.tsx`)
    .then((module) => module.default)
    .catch(() => undefined);

  if (!Component) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none relative size-full overflow-hidden select-none',
        className,
      )}
      inert
    >
      {fit === 'fill' ? (
        <ScaledFrame fit="cover" virtualWidth={virtualWidth ?? TEMPLATE_VIRTUAL_WIDTH}>
          <Component />
        </ScaledFrame>
      ) : type === 'template' ? (
        <ScaledFrame virtualWidth={virtualWidth ?? TEMPLATE_VIRTUAL_WIDTH}>
          <Component />
        </ScaledFrame>
      ) : type === 'block' ? (
        <ScaledFrame fit="contain" fluid={fluid} virtualWidth={virtualWidth ?? BLOCK_VIRTUAL_WIDTH}>
          <Component />
        </ScaledFrame>
      ) : (
        <div className="absolute inset-0 flex min-w-0 items-center-safe justify-center overflow-hidden p-4">
          <div className="w-full max-w-full min-w-0 [zoom:0.7] max-sm:[zoom:0.5] [&>*]:w-full [&>*]:max-w-full [&>*]:min-w-0">
            <Component />
          </div>
        </div>
      )}
    </div>
  );
};
