import { ImageResponse } from 'next/og';

export const renderAppIcon = (size: number, label = 'U') =>
  new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000000',
        color: '#ffffff',
        fontSize: size * 0.52,
        fontWeight: 600,
        letterSpacing: -1,
      }}
    >
      {label}
    </div>,
    { width: size, height: size },
  );
