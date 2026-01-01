import type { Route } from '.react-router/types/app/routes/main/+types';
import Header from '~/components/layout/Header';
import comunityImg from '~/components/ui/assets/comunity.jpg';
import Image from '~/components/ui/Image';
import ImageModal from '~/components/ui/ImageModal';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import type { MainResponse } from '~/types/api/v2';
import { SITE_NAME } from '~/utils/metadata';
import backgroundImg from './assets/background.avif';
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

const META = {
  ko: {
    title: SITE_NAME.ko,
    description:
      '창의와 지식을 융합하여 컴퓨터 기술의 진화를 선도합니다. 서울대학교 컴퓨터공학부는 세계적 수준의 교육과 연구를 통해 미래 IT 인재를 양성합니다.',
  },
  en: {
    title: 'Dept. of Computer Science and Engineering, SNU',
    description:
      'Leading the evolution of computing technology through creativity and knowledge integration. The Department of CSE at Seoul National University cultivates future IT talent through world-class education and research.',
  },
};

export default function MainPage({ loaderData }: Route.ComponentProps) {
  const { locale } = useLanguage();
  const meta = META[locale];

  return (
    <>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />

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

        {/* 이미지 모달 */}
        <ImageModal
          imageSrc={comunityImg}
          imageAlt="ComUnity 50주년 행사"
          title="ComUnity: 함께해 온 컴퓨팅 - 50주년 기념 동문 행사"
          onAction={() => {
            window.location.href = '/community/notice/24547';
          }}
        />
      </div>
    </>
  );
}
