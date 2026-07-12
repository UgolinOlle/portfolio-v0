import type { ReactNode } from 'react';

type PreviewFrameProps = {
  children: ReactNode;
};

// Cadre de rendu pour un component unitaire : centré, avec les guides en pointillés.
export const PreviewFrame = ({ children }: PreviewFrameProps) => {
  return (
    <div className="relative flex size-full flex-col items-center justify-center gap-4 overflow-hidden p-8 [--primary-foreground:oklch(0.985_0_0)] [--primary:oklch(0.205_0_0)] dark:[--primary-foreground:oklch(0.205_0_0)] dark:[--primary:oklch(0.985_0_0)]">
      <div className="absolute top-8 right-0 left-0 -translate-y-px border border-dashed border-border/50" />
      <div className="absolute right-0 bottom-8 left-0 translate-y-px border border-dashed border-border/50" />
      <div className="absolute top-0 bottom-0 left-8 -translate-x-px border border-dashed border-border/50" />
      <div className="absolute top-0 right-8 bottom-0 translate-x-px border border-dashed border-border/50" />
      {children}
    </div>
  );
};
