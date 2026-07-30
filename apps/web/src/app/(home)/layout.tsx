import { Footer } from '~/components/footer';
import { Header } from '~/components/header';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="group/layout relative mx-auto w-full flex-1 px-4 py-20 pt-24 font-sans lg:max-w-3xl">
      <Header />

      <main>{children}</main>

      <Footer />
    </div>
  );
}
