import { Shortcut, ShortcutKey, ShortcutSeparator } from '@/components/ui/ugolin/shortcut';

export default function ShortcutDemo() {
  return (
    <div className="flex flex-col items-start gap-3 text-sm text-muted-foreground">
      <div className="flex items-center gap-3">
        <span className="w-24">Recherche</span>
        <Shortcut>
          <ShortcutKey keyName="mod" />
          <ShortcutSeparator />
          <ShortcutKey>K</ShortcutKey>
        </Shortcut>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-24">Copier le lien</span>
        <Shortcut>
          <ShortcutKey keyName="mod" />
          <ShortcutSeparator />
          <ShortcutKey keyName="shift" />
          <ShortcutSeparator />
          <ShortcutKey>C</ShortcutKey>
        </Shortcut>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-24">Dashboard</span>
        <Shortcut>
          <ShortcutKey>G</ShortcutKey>
          <ShortcutSeparator variant="then" />
          <ShortcutKey>D</ShortcutKey>
        </Shortcut>
      </div>
    </div>
  );
}
