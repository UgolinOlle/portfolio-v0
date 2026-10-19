'use client';

import { type ReactNode, useLayoutEffect, useRef, useState } from 'react';

type ScaledFrameProps = {
  // Largeur virtuelle à laquelle le contenu est rendu avant d'être réduit.
  virtualWidth: number;
  // `width` : remplit la largeur, ancré en haut à gauche (pages entières : on voit le hero).
  // `contain` : tient entièrement dans le cadre, centré (blocks : une card, une section) ;
  // `virtualWidth` est alors une largeur maximale.
  // `cover` : pour les démos plein cadre (`previewFit: fill`) ; rendu à `virtualWidth`, puis
  // réduit pour remplir toute la largeur, la hauteur du cadre étant restituée au contenu.
  fit?: 'width' | 'contain' | 'cover';
  // `contain` seulement : rend le contenu à `virtualWidth` exactement, au lieu de l'épouser. Pour les
  // blocks fluides (`w-full`, container queries) qui s'effondreraient à leur largeur minimale.
  fluid?: boolean;
  // Échelle utilisée avant la première mesure (SSR).
  initialScale?: number;
  children: ReactNode;
};

// Marge laissée autour du contenu en mode `contain`, en pixels.
const CONTAIN_PADDING = 32;
// Agrandissement maximal d'un petit block (un bouton, une barre d'outils) pour qu'il occupe la card.
const CONTAIN_MAX_SCALE = 1.5;

export const ScaledFrame = ({
  virtualWidth,
  fit = 'width',
  fluid = false,
  initialScale = fit === 'contain' ? 0.4 : 0.26,
  children,
}: ScaledFrameProps) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(initialScale);
  // Hauteur du cadre ramenée à l'échelle du contenu (mode `cover`).
  const [coverHeight, setCoverHeight] = useState<number>();

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const content = contentRef.current;
    if (!frame || !content) return;

    const update = () => {
      if (fit === 'width') {
        setScale(frame.clientWidth / virtualWidth);
        return;
      }

      if (fit === 'cover') {
        const next = frame.clientWidth / virtualWidth;
        setScale(next);
        setCoverHeight(frame.clientHeight / next);
        return;
      }

      // `offset*` sizes ignore the transform, so these are the content's natural dimensions.
      const contentWidth = Math.max(content.offsetWidth, 1);
      const contentHeight = Math.max(content.offsetHeight, 1);
      setScale(
        Math.min(
          (frame.clientWidth - CONTAIN_PADDING) / contentWidth,
          (frame.clientHeight - CONTAIN_PADDING) / contentHeight,
          CONTAIN_MAX_SCALE,
        ),
      );
    };

    const observer = new ResizeObserver(update);
    observer.observe(frame);
    if (fit === 'contain') observer.observe(content);

    return () => observer.disconnect();
  }, [fit, virtualWidth]);

  if (fit === 'contain') {
    // Flex centring lets the unscaled box overflow evenly on both sides; scaling around its
    // centre then lands it in the middle of the frame.
    return (
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        ref={frameRef}
      >
        <div
          className="shrink-0"
          ref={contentRef}
          // Shrink-wraps narrow blocks (a single card) so they aren't lost in a wide canvas.
          style={{
            width: fluid ? virtualWidth : 'max-content',
            maxWidth: virtualWidth,
            transform: `scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden" ref={frameRef}>
      <div
        ref={contentRef}
        style={{
          width: virtualWidth,
          height: fit === 'cover' ? coverHeight : undefined,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
};
