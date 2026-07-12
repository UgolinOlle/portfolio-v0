import { TextLoop } from '~/components/ui/text-loop';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-100 px-0 py-4 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <a href="https://github.com/UgolinOlle" rel="noreferrer" target="_blank">
          <TextLoop className="text-xs text-zinc-500">
            <span>© {new Date().getFullYear()} Ugolin Ollé</span>
            <span>Built with ❤️.</span>
          </TextLoop>
        </a>
      </div>
    </footer>
  );
}
