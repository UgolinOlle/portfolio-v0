import { EMAIL } from '~/lib/constants';

type ConstructionBannerProps = {
  readonly message?: string;
};

// Slim inline notice for the docs layouts (offset by the fixed 3.5rem navbar); /ui shows a Bêta tag instead.
function ConstructionBanner({
  message = 'Whoa UI est en bêta : certains éléments peuvent encore changer. Un bug ?',
}: ConstructionBannerProps) {
  return (
    <div className="mt-14 w-full border-b border-dashed bg-muted/30 px-4 py-2 text-center text-xs text-pretty text-muted-foreground">
      {message}{' '}
      <a
        className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
        href={`mailto:${EMAIL}`}
      >
        Écrivez-moi
      </a>
    </div>
  );
}

export { ConstructionBanner };
