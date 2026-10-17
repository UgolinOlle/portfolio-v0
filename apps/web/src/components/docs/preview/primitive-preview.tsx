import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { RegistryCodeBlock } from '~/components/docs/code-block/registry-code-block';

import { PreviewFrame } from './preview-frame';
import { PreviewShell } from './preview-shell';

type PrimitivePreviewProps = {
  // Example file in `examples/primitives/<name>.tsx`.
  name: string;
  className?: string;
};

// Preview of a shadcn primitive (`packages/shadcn/components/ui`). Those are not registry items:
// there is no `<name>-demo` manifest, so the code shown is the example file itself.
export const PrimitivePreview = async ({ name, className }: PrimitivePreviewProps) => {
  const filePath = join('examples', 'primitives', `${name}.tsx`);
  const [Component, content] = await Promise.all([
    import(`../../../../examples/primitives/${name}.tsx`).then((module) => module.default),
    readFile(join(process.cwd(), filePath), 'utf-8'),
  ]);

  return (
    <PreviewShell
      className={className}
      code={
        <RegistryCodeBlock
          className="size-full max-h-none rounded-none border-none shadow-none"
          files={[{ path: `${name}.tsx`, content, type: 'registry:example' }]}
        />
      }
      fullPage={false}
      preview={
        <PreviewFrame>
          <Component />
        </PreviewFrame>
      }
    />
  );
};
