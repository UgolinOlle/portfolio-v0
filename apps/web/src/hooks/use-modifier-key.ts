'use client';

import { useEffect, useState } from 'react';

// Label of the platform's shortcut modifier, for keyboard hints like "⌘ K" / "Ctrl K".
export function useModifierKey() {
  const [modifierKey, setModifierKey] = useState('⌘');

  useEffect(() => {
    if (!/mac|iphone|ipad/i.test(navigator.userAgent)) setModifierKey('Ctrl');
  }, []);

  return modifierKey;
}
