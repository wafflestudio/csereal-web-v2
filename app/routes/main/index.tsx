import type { Route } from '.react-router/types/app/routes/main/+types';
import Image from '~/components/common/Image';
import Header from '~/components/layout/Header';
import { BASE_URL } from '~/constants/api';
import type { MainResponse } from '~/types/api/v2';
import backgroundImg from './assets/background.png';
import GraphicSection from './components/GraphicSection';
import ImportantSection from './components/ImportantSection';
import LinkSection from './components/LinkSection';
import NoticeSection from './components/NoticeSection';
import NewsSection from './components/news/NewsSection';

export async function loader() {
  const response = await fetch(`${BASE_URL}/v2`);
  if (!response.ok) throw new Error('Failed to fetch main data');
  return (await response.json()) as MainResponse;
}

export default function MainPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="relative w-full">
      <Header />
      <div className="absolute left-0 right-0 top-0 -z-50 hidden aspect-1336/800 sm:block">
        <Image
          src={backgroundImg}
          alt=""
          className="object-cover w-full h-full"
        />
      </div>
      <GraphicSection />
      <NewsSection mainNews={loaderData.slides} />
      <ImportantSection importantList={loaderData.importants} />
      <NoticeSection allMainNotice={loaderData.notices} />
      <LinkSection />
    </div>
  );
}
