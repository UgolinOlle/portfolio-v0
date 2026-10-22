import { Screenshots, type Screenshot } from '~/components/projects/screenshots';
import { getPublicImageSize } from '~/lib/image-size';

type ScreenshotsWithSizeProps = {
  items: Screenshot[];
};

/** MDX entry point: resolves each screenshot's intrinsic size on the server, then renders the gallery. */
export async function ScreenshotsWithSize({ items }: ScreenshotsWithSizeProps) {
  const sized = await Promise.all(
    items.map(async (item) => {
      const size = await getPublicImageSize(item.light);

      return size ? { ...item, ...size } : item;
    }),
  );

  return <Screenshots items={sized} />;
}
