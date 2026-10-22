import { open } from 'node:fs/promises';
import path from 'node:path';

export type ImageSize = { width: number; height: number };

const cache = new Map<string, Promise<ImageSize | undefined>>();

/** Reads PNG / GIF dimensions from the file header only (no dependency, a few bytes per file). */
const readSize = async (publicPath: string): Promise<ImageSize | undefined> => {
  const file = await open(path.join(process.cwd(), 'public', publicPath), 'r').catch(
    () => undefined,
  );

  if (!file) {
    return undefined;
  }

  try {
    const header = Buffer.alloc(24);
    await file.read(header, 0, 24, 0);

    if (header.toString('ascii', 1, 4) === 'PNG') {
      return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
    }

    if (header.toString('ascii', 0, 3) === 'GIF') {
      return { width: header.readUInt16LE(6), height: header.readUInt16LE(8) };
    }

    return undefined;
  } finally {
    await file.close();
  }
};

/** Intrinsic size of a file under `public/`, so `next/image` can reserve its space (no CLS). */
export const getPublicImageSize = (publicPath: string): Promise<ImageSize | undefined> => {
  const cached = cache.get(publicPath);

  if (cached) {
    return cached;
  }

  const size = readSize(publicPath);
  cache.set(publicPath, size);

  return size;
};
