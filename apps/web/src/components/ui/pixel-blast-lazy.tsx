'use client';

import dynamic from 'next/dynamic';

/**
 * PixelBlast pulls in three.js + postprocessing (several hundred KB). It's purely decorative, so it
 * loads in its own chunk after hydration instead of blocking the page's first render.
 */
const PixelBlastLazy = dynamic(() => import('~/components/ui/pixel-blast'), { ssr: false });

export default PixelBlastLazy;
