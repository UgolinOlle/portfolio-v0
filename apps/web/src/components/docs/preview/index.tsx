import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@portfolio-v0/shadcn/components/tabs';
import { cn } from '@portfolio-v0/shadcn/utils';

import { CodeIcon, EyeIcon } from 'lucide-react';

import { PreviewCode } from './preview-code';
import { PreviewFrame } from './preview-frame';

type PreviewProps = {
  // Nom du fichier dans `apps/web/examples/` (sans extension), ex. "blog".
  path: string;
  className?: string;
  type?: 'component' | 'block';
};

export const Preview = async ({ path, className, type = 'component' }: PreviewProps) => {
  const code = await readFile(join(process.cwd(), 'examples', `${path}.tsx`), 'utf-8');

  const Component = await import(`../../../../examples/${path}.tsx`).then(
    (module) => module.default,
  );

  return (
    <div
      className={cn(
        'size-full overflow-hidden rounded-lg border bg-background',
        type === 'block' ? 'h-192' : 'h-128',
        className,
      )}
    >
      <Tabs className="size-full gap-0" defaultValue="preview">
        <TabsList className="w-full rounded-none border-b">
          <TabsTrigger value="preview">
            <EyeIcon className="text-muted-foreground" size={16} />
            Preview
          </TabsTrigger>
          <TabsTrigger value="code">
            <CodeIcon className="text-muted-foreground" size={16} />
            Code
          </TabsTrigger>
        </TabsList>
        <TabsContent
          className={cn(
            'not-fumadocs-codeblock size-full',
            type === 'block' ? 'overflow-auto' : 'overflow-hidden',
          )}
          value="preview"
        >
          {type === 'block' ? (
            <Component />
          ) : (
            <PreviewFrame>
              <Component />
            </PreviewFrame>
          )}
        </TabsContent>
        <TabsContent className="size-full overflow-y-auto bg-background" value="code">
          <PreviewCode code={code} filename={`${path}.tsx`} language="tsx" />
        </TabsContent>
      </Tabs>
    </div>
  );
};
