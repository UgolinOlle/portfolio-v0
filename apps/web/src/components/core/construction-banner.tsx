import PixelBlast from '~/components/ui/pixel-blast';

type ConstructionBannerProps = {
  readonly message?: string;
};

function ConstructionBanner({
  message = 'This section is under construction and may contain bugs. Please send an email to hello@ugolin-olle.com if you find any.',
}: ConstructionBannerProps) {
  return (
    <div className="relative flex h-40 w-full items-center justify-center overflow-hidden font-semibold">
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

      <p className="relative z-10 max-w-2xl px-6 text-center">{message}</p>
    </div>
  );
}

export { ConstructionBanner };
