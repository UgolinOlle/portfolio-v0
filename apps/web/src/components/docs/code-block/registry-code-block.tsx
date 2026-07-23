'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import {
  type BundledLanguage,
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockItem,
  type CodeBlockProps,
  CodeBlockSelect,
  CodeBlockSelectContent,
  CodeBlockSelectItem,
  CodeBlockSelectTrigger,
  CodeBlockSelectValue,
} from '~/components/docs/code-block';
import type { RegistryItemFile } from '~/lib/registry-item';

const languageFromPath = (path: string) => path.split('.').pop() ?? 'tsx';

type RegistryCodeBlockProps = {
  files: RegistryItemFile[];
  className?: string;
};

export const RegistryCodeBlock = ({ files, className }: RegistryCodeBlockProps) => {
  const data: CodeBlockProps['data'] = files.map((file) => ({
    language: languageFromPath(file.path),
    filename: file.path,
    code: file.content,
  }));

  return (
    <CodeBlock className={cn('max-h-128', className)} data={data} defaultValue={data[0]?.filename}>
      <CodeBlockHeader>
        {data.length > 1 ? (
          <CodeBlockSelect>
            <CodeBlockSelectTrigger>
              <CodeBlockSelectValue />
            </CodeBlockSelectTrigger>
            <CodeBlockSelectContent>
              {(item) => (
                <CodeBlockSelectItem key={item.filename} value={item.filename}>
                  {item.filename}
                </CodeBlockSelectItem>
              )}
            </CodeBlockSelectContent>
          </CodeBlockSelect>
        ) : (
          <span className="flex-1 truncate px-2 font-mono text-xs text-muted-foreground">
            {data[0]?.filename}
          </span>
        )}

        <CodeBlockCopyButton className="ml-auto" />
      </CodeBlockHeader>

      <CodeBlockBody className="overflow-auto">
        {(item) => (
          <CodeBlockItem key={item.filename} value={item.filename}>
            <CodeBlockContent language={item.language as BundledLanguage}>
              {item.code}
            </CodeBlockContent>
          </CodeBlockItem>
        )}
      </CodeBlockBody>
    </CodeBlock>
  );
};
