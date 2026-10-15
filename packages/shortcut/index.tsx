'use client';

import { type ComponentProps, useSyncExternalStore } from 'react';

import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { cn } from '@/lib/utils';

// Noms de touches courants -> symbole affiché + libellé lu par les lecteurs d'écran.
// `mod` vaut ⌘ sur Apple et Ctrl ailleurs.
const keys = {
  mod: { mac: '⌘', other: 'Ctrl', label: { mac: 'Command', other: 'Control' } },
  cmd: { mac: '⌘', other: '⌘', label: { mac: 'Command', other: 'Command' } },
  ctrl: { mac: '⌃', other: 'Ctrl', label: { mac: 'Control', other: 'Control' } },
  alt: { mac: '⌥', other: 'Alt', label: { mac: 'Option', other: 'Alt' } },
  shift: { mac: '⇧', other: 'Shift', label: { mac: 'Shift', other: 'Shift' } },
  enter: { mac: '↵', other: 'Enter', label: { mac: 'Enter', other: 'Enter' } },
  backspace: { mac: '⌫', other: '⌫', label: { mac: 'Backspace', other: 'Backspace' } },
  escape: { mac: 'Esc', other: 'Esc', label: { mac: 'Escape', other: 'Escape' } },
  tab: { mac: '⇥', other: 'Tab', label: { mac: 'Tab', other: 'Tab' } },
  up: { mac: '↑', other: '↑', label: { mac: 'Arrow up', other: 'Arrow up' } },
  down: { mac: '↓', other: '↓', label: { mac: 'Arrow down', other: 'Arrow down' } },
  left: { mac: '←', other: '←', label: { mac: 'Arrow left', other: 'Arrow left' } },
  right: { mac: '→', other: '→', label: { mac: 'Arrow right', other: 'Arrow right' } },
} as const;

export type ShortcutKeyName = keyof typeof keys;

const subscribe = () => () => {};
const getIsMac = () => /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
// Rendu serveur : on affiche la variante non-Apple, corrigée à l'hydratation.
const getIsMacOnServer = () => false;

export const useIsMac = () => useSyncExternalStore(subscribe, getIsMac, getIsMacOnServer);

export type ShortcutProps = ComponentProps<typeof KbdGroup>;

// Des `<kbd>` imbriqués dans un `<kbd>` décrivent une combinaison de touches (spec HTML).
export const Shortcut = ({ className, ...props }: ShortcutProps) => (
  <KbdGroup className={cn('gap-0.5', className)} {...props} />
);

export type ShortcutKeyProps = ComponentProps<typeof Kbd> & {
  // Touche connue, rendue par son symbole selon la plateforme. Sinon, utiliser `children`.
  keyName?: ShortcutKeyName;
};

export const ShortcutKey = ({ keyName, className, children, ...props }: ShortcutKeyProps) => {
  const isMac = useIsMac();
  const key = keyName ? keys[keyName] : undefined;
  const platform = isMac ? 'mac' : 'other';

  return (
    <Kbd title={key?.label[platform]} className={cn('font-mono', className)} {...props}>
      {key ? (
        <>
          <span aria-hidden="true">{key[platform]}</span>
          <span className="sr-only">{key.label[platform]}</span>
        </>
      ) : (
        children
      )}
    </Kbd>
  );
};

export type ShortcutSeparatorProps = ComponentProps<'span'> & {
  // `then` pour une séquence (ex. `g` puis `d`), `plus` pour une combinaison simultanée.
  variant?: 'plus' | 'then';
};

export const ShortcutSeparator = ({
  variant = 'plus',
  className,
  children,
  ...props
}: ShortcutSeparatorProps) => (
  <span className={cn('px-0.5 text-xs text-muted-foreground', className)} {...props}>
    <span aria-hidden="true">{children ?? (variant === 'then' ? '›' : '+')}</span>
    <span className="sr-only">{variant === 'then' ? ' then ' : ' plus '}</span>
  </span>
);
