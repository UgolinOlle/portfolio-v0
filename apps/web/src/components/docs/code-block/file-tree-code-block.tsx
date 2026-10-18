'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { useMemo, useState } from 'react';

import {
  type BundledLanguage,
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockItem,
} from '~/components/docs/code-block';
import {
  ChevronRightIcon,
  FileCodeIcon,
  FileCssIcon,
  FileIcon,
  FileJsIcon,
  FileTsIcon,
  FileTsxIcon,
  FolderIcon,
  FolderOpenIcon,
} from '~/components/icons/ui';
import type { RegistryItemFile } from '~/lib/registry-item';

type TreeNode = { name: string; path: string; children: TreeNode[]; file?: RegistryItemFile };

const displayPath = (file: RegistryItemFile) => file.target ?? file.path;

const buildTree = (files: RegistryItemFile[]): TreeNode[] => {
  const root: TreeNode = { name: '', path: '', children: [] };

  for (const file of files) {
    let node = root;
    const segments = displayPath(file).split('/');

    segments.forEach((name, index) => {
      const path = segments.slice(0, index + 1).join('/');
      let child = node.children.find((candidate) => candidate.path === path);

      if (!child) {
        child = { name, path, children: [] };
        node.children.push(child);
      }
      if (index === segments.length - 1) child.file = file;
      node = child;
    });
  }

  // Folders first, then files, each alphabetically.
  const sort = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => Number(!!a.file) - Number(!!b.file) || a.name.localeCompare(b.name));
    nodes.forEach((node) => sort(node.children));
  };
  sort(root.children);

  return root.children;
};

const fileIcons: Record<string, typeof FileIcon> = {
  tsx: FileTsxIcon,
  jsx: FileTsxIcon,
  ts: FileTsIcon,
  js: FileJsIcon,
  css: FileCssIcon,
  json: FileCodeIcon,
  mdx: FileCodeIcon,
};

const FileTypeIcon = ({ name }: { name: string }) => {
  const Icon = fileIcons[name.split('.').pop() ?? ''] ?? FileIcon;

  return <Icon aria-hidden="true" className="size-3.5 shrink-0" />;
};

const rowClassName = cn(
  'flex h-7 w-full items-center gap-1.5 pe-2 text-start font-mono text-xs transition-colors',
  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
);

type TreeProps = {
  nodes: TreeNode[];
  depth: number;
  active: string;
  onSelect: (path: string) => void;
};

const Tree = ({ nodes, depth, active, onSelect }: TreeProps) => (
  <ul>
    {nodes.map((node) => {
      const indent = { paddingInlineStart: `${depth * 12 + 8}px` };

      if (!node.file) {
        return (
          <li key={node.path}>
            <details className="group" open>
              <summary
                className={cn(
                  rowClassName,
                  'cursor-pointer list-none text-foreground/60 hover:bg-foreground/3 hover:text-foreground [&::-webkit-details-marker]:hidden group-open:[&>svg:first-child]:rotate-90',
                )}
                style={indent}
              >
                <ChevronRightIcon
                  aria-hidden="true"
                  className="size-3 shrink-0 transition-transform duration-150"
                />
                <FolderIcon aria-hidden="true" className="size-3.5 shrink-0 group-open:hidden" />
                <FolderOpenIcon
                  aria-hidden="true"
                  className="hidden size-3.5 shrink-0 group-open:block"
                />
                <span className="truncate">{node.name}</span>
              </summary>
              <Tree active={active} depth={depth + 1} nodes={node.children} onSelect={onSelect} />
            </details>
          </li>
        );
      }

      const selected = displayPath(node.file) === active;

      return (
        <li key={node.path}>
          <button
            aria-current={selected ? 'true' : undefined}
            className={cn(
              rowClassName,
              'relative',
              selected
                ? 'bg-foreground/3 text-foreground before:absolute before:inset-y-0 before:start-0 before:w-px before:bg-foreground'
                : 'text-foreground/55 hover:bg-foreground/3 hover:text-foreground',
            )}
            // File rows align with folder icons (chevron width + gap).
            style={{ paddingInlineStart: `${depth * 12 + 8 + 18}px` }}
            onClick={() => onSelect(displayPath(node.file as RegistryItemFile))}
            type="button"
          >
            <FileTypeIcon name={node.name} />
            <span className="truncate">{node.name}</span>
          </button>
        </li>
      );
    })}
  </ul>
);

type FileTreeCodeBlockProps = {
  files: RegistryItemFile[];
  className?: string;
};

// Explorer layout: a "Files" tree on the left, the active file's code on the right. The two panes
// scroll independently inside a bounded height (the parent decides it; this fills it).
export const FileTreeCodeBlock = ({ files, className }: FileTreeCodeBlockProps) => {
  const tree = useMemo(() => buildTree(files), [files]);
  const data = useMemo(
    () =>
      files.map((file) => ({
        language: displayPath(file).split('.').pop() ?? 'tsx',
        filename: displayPath(file),
        code: file.content,
      })),
    [files],
  );
  const [active, setActive] = useState(data[0]?.filename ?? '');

  return (
    <CodeBlock
      className={cn('flex h-full min-h-0 border-0', className)}
      data={data}
      onValueChange={setActive}
      value={active}
    >
      <div className="flex w-56 shrink-0 flex-col border-e border-foreground/10 max-sm:w-40">
        <div className="label-mono flex h-9 shrink-0 items-center border-b border-foreground/10 px-3 text-foreground/45">
          Files
        </div>
        <nav aria-label="Files" className="min-h-0 flex-1 overflow-auto py-1">
          <Tree active={active} depth={0} nodes={tree} onSelect={setActive} />
        </nav>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <CodeBlockHeader className="shrink-0">
          <span className="flex-1 truncate px-2 font-mono text-xs text-muted-foreground">
            {active}
          </span>
          <CodeBlockCopyButton className="ml-auto size-7 rounded-none" />
        </CodeBlockHeader>

        {/* Keyed on the file so every selection starts back at the top-left. */}
        <CodeBlockBody key={active} className="min-h-0 flex-1 overflow-auto [scrollbar-width:thin]">
          {(item) => (
            <CodeBlockItem
              className="[&_code]:w-max [&_code]:min-w-full [&_code]:overflow-visible"
              key={item.filename}
              value={item.filename}
            >
              <CodeBlockContent language={item.language as BundledLanguage}>
                {item.code}
              </CodeBlockContent>
            </CodeBlockItem>
          )}
        </CodeBlockBody>
      </div>
    </CodeBlock>
  );
};
