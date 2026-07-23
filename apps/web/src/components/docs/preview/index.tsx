import { Tabs, TabsContent, TabsList, TabsTrigger } from '@portfolio-v0/shadcn/components/tabs';
import { cn } from '@portfolio-v0/shadcn/utils';

import { CodeIcon, EyeIcon } from 'lucide-react';

import { RegistryCodeBlock } from '~/components/docs/code-block/registry-code-block';
import { getRegistryDemoName } from '~/lib/registry';
import { getRegistryItemManifest } from '~/lib/registry-item';

import { PreviewFrame } from './preview-frame';

type PreviewProps = {
  path: string;
  className?: string;
  type?: 'component' | 'block' | 'template';
};

export const Preview = async ({ path, className, type = 'component' }: PreviewProps) => {
  const [Component, demoManifest] = await Promise.all([
    import(`../../../../examples/${path}.tsx`).then((module) => module.default),
    getRegistryItemManifest(getRegistryDemoName(path)),
  ]);
  const isFullPage = type !== 'component';

  return (
    <div
      className={cn(
        'size-full overflow-hidden rounded-xl border bg-background shadow-xs',
        className,
      )}
    >
      <Tabs className="size-full gap-0" defaultValue="preview">
        <div className="flex items-center border-b bg-muted/30 px-2">
          <TabsList className="h-11 bg-transparent p-0" variant="line">
            <TabsTrigger
              className="gap-1.5 text-xs font-medium text-muted-foreground data-active:text-foreground"
              value="preview"
            >
              <EyeIcon size={14} />
              Preview
            </TabsTrigger>

            <TabsTrigger
              className="gap-1.5 text-xs font-medium text-muted-foreground data-active:text-foreground"
              value="code"
            >
              <CodeIcon size={14} />
              Code
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          className={cn(isFullPage ? 'h-192 overflow-auto' : 'h-128 overflow-hidden')}
          value="preview"
        >
          {isFullPage ? (
            <Component />
          ) : (
            <PreviewFrame>
              <Component />
            </PreviewFrame>
          )}
        </TabsContent>

        <TabsContent className="h-128 overflow-hidden" value="code">
          <RegistryCodeBlock
            className="size-full max-h-none rounded-none border-none shadow-none"
            files={demoManifest.files}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
