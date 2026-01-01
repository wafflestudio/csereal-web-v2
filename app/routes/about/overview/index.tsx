import type { Route } from '.react-router/types/app/routes/about/overview/+types/index';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import ContentSection from '~/components/feature/content/ContentSection';
import PageLayout from '~/components/layout/PageLayout';
import Attachments from '~/components/ui/Attachments';
import Button from '~/components/ui/Button';
import HTMLViewer from '~/components/ui/HTMLViewer';
import Image from '~/components/ui/Image';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import commonTranslations from '~/translations.json';
import type { AboutContent } from '~/types/api/v2/about/content';
import { processHtmlForCsp } from '~/utils/csp';
import { getLocaleFromPathname } from '~/utils/string';
import brochure1 from '../assets/brochure1.avif';
import brochure2 from '../assets/brochure2.avif';

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);

  const response = await fetch(
    `${BASE_URL}/v2/about/overview?language=${locale}`,
  );
  if (!response.ok)
    throw new Error('Failed to fetch overview data', { cause: response });

  const data = (await response.json()) as AboutContent;

  return {
    ...data,
    description: processHtmlForCsp(data.description),
  };
}

const META = {
  ko: {
    title: '학부 소개',
    description:
      '서울대학교 컴퓨터공학부는 정보화 사회의 핵심 학문으로서 컴퓨터 하드웨어와 소프트웨어 기술 연구 및 인력 양성의 구심체입니다. 첨단 컴퓨터 기술 연구와 이를 통한 인력 양성을 선도합니다.',
  },
  en: {
    title: 'About',
    description:
      'The Department of Computer Science and Engineering at Seoul National University is a hub for research and education in computing technology, leading advanced computer technology research and talent cultivation.',
  },
};

export default function Overview({ loaderData }: Route.ComponentProps) {
  const { description, attachments, imageURL } = loaderData;
  const { t, localizedPath, locale } = useLanguage({
    ...commonTranslations,
    '학부 소개 책자': 'Department Brochure',
  });

  const meta = META[locale];

  return (
    <PageLayout
      title={t('학부 소개')}
      titleSize="xl"
      padding="none"
      pageTitle={meta.title}
      pageDescription={meta.description}
      subNav={{
        title: t('소개'),
        titlePath: '/about/overview',
        items: [
          { name: t('학부 소개'), path: '/about/overview', depth: 1 },
          { name: t('학부장 인사말'), path: '/about/greetings', depth: 1 },
          { name: t('연혁'), path: '/about/history', depth: 1 },
          { name: t('졸업생 진로'), path: '/about/future-careers', depth: 1 },
          { name: t('동아리 소개'), path: '/about/student-clubs', depth: 1 },
          { name: t('시설 안내'), path: '/about/facilities', depth: 1 },
          { name: t('연락처'), path: '/about/contact', depth: 1 },
          { name: t('찾아오는 길'), path: '/about/directions', depth: 1 },
        ],
      }}
    >
      <ContentSection tone="neutral" padding="overviewTop">
        <LoginVisible allow="ROLE_STAFF">
          <div className="mb-8 text-right">
            <Button
              as="link"
              to={localizedPath('/about/overview/edit')}
              variant="outline"
              tone="neutral"
              size="md"
            >
              편집
            </Button>
          </div>
        </LoginVisible>
        <div className="flex flex-col-reverse items-start gap-6 sm:flex-row sm:gap-10">
          <div className="sm:w-[20rem] sm:grow">
            <HTMLViewer html={description} />
          </div>
          {imageURL && (
            <div className="w-full sm:w-auto">
              <Image
                src={imageURL}
                alt="학교 전경"
                width={320}
                height={216}
                className="w-full object-contain sm:w-80"
              />
            </div>
          )}
        </div>
      </ContentSection>
      <ContentSection tone="white" padding="overviewBottom">
        <h2 className="mb-6 text-base font-semibold">{t('학부 소개 책자')}</h2>
        <div className="mb-10 flex flex-col gap-6 sm:flex-row">
          <Image src={brochure1} width={227} height={320} alt="소개 책자" />
          <Image src={brochure2} width={227} height={320} alt="소개 책자" />
        </div>
        <Attachments files={attachments} />
      </ContentSection>
    </PageLayout>
  );
}
