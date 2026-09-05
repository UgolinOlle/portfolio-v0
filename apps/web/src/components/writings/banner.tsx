import PixelBlast from '../ui/pixel-blast';

function WritingsBanner() {
  return (
    <div className="relative flex h-50 w-full items-center justify-center overflow-hidden font-semibold">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
        <PixelBlast
          variant="square"
          pixelSize={4}
          color="#B497CF"
          patternScale={2}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.5}
          edgeFade={0.25}
          transparent
        />
      </div>

      <p className="relative z-10 max-w-2xl px-6 text-center">
        It might have some mistakes, but I am working on it. Please send an email to{' '}
        <a href="mailto:hello@ugolin-olle.com">hello@ugolin-olle.com</a> if you find any mistakes.
      </p>
    </div>
  );
}

export { WritingsBanner };
