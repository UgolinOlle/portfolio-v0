import { HomeContent } from '~/components/sections/home-section';
import { RecentWritingsLoader } from '~/components/writings/recent-writings-loader';

export default function Home() {
  return <HomeContent recentWritings={<RecentWritingsLoader />} />;
}
