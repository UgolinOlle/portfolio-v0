import { FileTreeCodeBlock } from '~/components/docs/code-block/file-tree-code-block';
import { RegistryCodeBlock } from '~/components/docs/code-block/registry-code-block';
import { getRegistryDemoName } from '~/lib/registry';
import { getRegistryItemManifest } from '~/lib/registry-item';

import { PreviewFrame } from './preview-frame';
import { PreviewShell } from './preview-shell';

type PreviewProps = {
  path: string;
  className?: string;
  type?: 'component' | 'block' | 'template';
  // `fill`: the demo covers the whole panel, edge to edge (backgrounds, heroes).
  fit?: 'frame' | 'fill';
};

export const Preview = async ({
  path,
  className,
  type = 'component',
  fit = 'frame',
}: PreviewProps) => {
  const isFullPage = type !== 'component';
  const isTemplate = type === 'template';
  const [Component, demoManifest, templateManifest] = await Promise.all([
    import(`../../../../examples/${path}.tsx`).then((module) => module.default),
    getRegistryItemManifest(getRegistryDemoName(path)),
    // Templates list their own source files in the explorer, next to the demo.
    isTemplate ? getRegistryItemManifest(path) : undefined,
  ]);

  return (
    <PreviewShell
      className={className}
      code={
        templateManifest ? (
          <FileTreeCodeBlock files={[...templateManifest.files, ...demoManifest.files]} />
        ) : (
          <RegistryCodeBlock
            className="size-full max-h-none rounded-none border-none shadow-none"
            files={demoManifest.files}
          />
        )
      }
      fill={isTemplate}
      fullPage={isFullPage}
      preview={
        isTemplate ? (
          // The docs page uses Lenis smooth scroll: opt the template out so its own scrollers get the wheel.
          <div
            className="size-full overflow-hidden rounded-lg border border-foreground/10 bg-background"
            data-lenis-prevent
          >
            <Component />
          </div>
        ) : fit === 'fill' ? (
          <div className="size-full">
            <Component />
          </div>
        ) : isFullPage ? (
          <div className="flex w-full items-center-safe justify-center p-6 sm:p-10">
            <Component />
          </div>
        ) : (
          <PreviewFrame>
            <Component />
          </PreviewFrame>
        )
      }
    />
  );
};
