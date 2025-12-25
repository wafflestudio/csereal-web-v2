import type { Route } from '.react-router/types/app/routes/about/overview/+types/index';
import Attachments from '~/components/common/Attachments';
import Button from '~/components/common/Button';
import ContentSection from '~/components/common/ContentSection';
import HTMLViewer from '~/components/common/HTMLViewer';
import Image from '~/components/common/Image';
import LoginVisible from '~/components/common/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import commonTranslations from '~/translations.json';
import type { AboutContent } from '~/types/api/v2/about/content';
import { getLocaleFromPathname } from '~/utils/string';
import brochure1 from '../assets/brochure1.png';
import brochure2 from '../assets/brochure2.png';

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);

  const response = await fetch(
    `${BASE_URL}/v2/about/overview?language=${locale}`,
  );
  if (!response.ok)
    throw new Error('Failed to fetch overview data', { cause: response });

  return (await response.json()) as AboutContent;
}

export default function Overview({ loaderData }: Route.ComponentProps) {
  const { description, attachments, imageURL } = loaderData;
  const { t, localizedPath } = useLanguage({
    ...commonTranslations,
    '학부 소개 책자': 'Department Brochure',
  });

  return (
    <PageLayout
      title={t('학부 소개')}
      breadcrumb={[
        { name: t('소개'), path: '/about' },
        { name: t('학부 소개'), path: '/about/overview' },
      ]}
      titleSize="xl"
      padding="none"
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
