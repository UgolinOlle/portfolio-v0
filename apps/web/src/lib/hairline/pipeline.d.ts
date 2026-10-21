type Mount = (
  ctx: { stage: HTMLElement; svg: SVGSVGElement; read: { textContent: string | null } },
  value: number,
) => { set: (value: number) => void; destroy: () => void };
export const mount: Mount;
export const means: string;
export const range: [number, number, number];
