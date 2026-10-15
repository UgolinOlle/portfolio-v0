import { RegistryCodeBlock } from '~/components/docs/code-block/registry-code-block';
import { getRegistryDemoName } from '~/lib/registry';
import { getRegistryItemManifest } from '~/lib/registry-item';

import { PreviewFrame } from './preview-frame';
import { PreviewShell } from './preview-shell';

type PreviewProps = {
  path: string;
  className?: string;
  type?: 'component' | 'block' | 'template';
};

export const Preview = async ({ path, className, type = 'component' }: PreviewProps) => {
  const [Component, demoManifest] = await Promise.all([
    (type === 'component'
      ? import(`../../../../examples/components/${path}.tsx`)
      : import(`../../../../examples/${path}.tsx`)
    ).then((module) => module.default),
    getRegistryItemManifest(getRegistryDemoName(path)),
  ]);
  const isFullPage = type !== 'component';

  return (
    <PreviewShell
      className={className}
      code={
        <RegistryCodeBlock
          className="size-full max-h-none rounded-none border-none shadow-none"
          files={demoManifest.files}
        />
      }
      fullPage={isFullPage}
      preview={
        isFullPage ? (
          <div className="w-full p-6 sm:p-10">
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
