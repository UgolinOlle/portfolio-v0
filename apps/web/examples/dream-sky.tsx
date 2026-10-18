import { DreamSky } from '@/components/ui/ugolin/dream-sky';

export default function DreamSkyExample() {
  return (
    <DreamSky className="flex min-h-[28rem] w-full flex-col items-center justify-center gap-6 px-6 text-center text-white">
      <h2 className="text-4xl font-semibold tracking-tight [text-shadow:0_2px_24px_rgb(0_80_200/0.35)] sm:text-6xl">
        Where your dream
        <br />
        designs come true
      </h2>
      <p className="max-w-sm text-lg text-white/85">
        We turn floating ideas into thoughtful, beautiful designs.
      </p>
      <button
        type="button"
        className="rounded-full bg-white/80 px-6 py-3 font-medium text-sky-600 shadow-lg shadow-sky-900/10 backdrop-blur transition-transform duration-150 ease-out active:scale-[0.97]"
      >
        Book a call
      </button>
    </DreamSky>
  );
}
