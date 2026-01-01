import type { Route } from '.react-router/types/app/routes/about/future-careers/+types/index';
import type { LoaderFunctionArgs } from 'react-router';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import ContentSection from '~/components/feature/content/ContentSection';
import PageLayout from '~/components/layout/PageLayout';
import Button from '~/components/ui/Button';
import HTMLViewer from '~/components/ui/HTMLViewer';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAboutSubNav } from '~/hooks/useSubNav';
import type { FutureCareersResponse } from '~/types/api/v2/about/future-careers';
import { processHtmlForCsp } from '~/utils/csp';
import { getLocaleFromPathname } from '~/utils/string';
import CareerCompanies from './components/CareerCompanies';
import CareerStat from './components/CareerStat';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);

  const response = await fetch(
    `${BASE_URL}/v2/about/future-careers?language=${locale}`,
  );
  if (!response.ok) throw new Error('Failed to fetch future careers');

  const data = (await response.json()) as FutureCareersResponse;

  return {
    ...data,
    description: processHtmlForCsp(data.description),
  };
}

const META = {
  ko: {
    title: '졸업생 진로',
    description:
      '서울대학교 컴퓨터공학부 졸업생들의 진로 현황과 취업 정보를 소개합니다. 주요 진출 분야와 기업, 창업 현황 등을 확인하실 수 있습니다.',
  },
  en: {
    title: 'Career Paths',
    description:
      'Career paths and employment information of graduates from the Department of Computer Science and Engineering at Seoul National University.',
  },
};

export default function FutureCareersPage({
  loaderData: data,
}: Route.ComponentProps) {
  const { t, localizedPath, locale } = useLanguage({
    '졸업생 진로': 'Career Paths',
  });
  const subNav = useAboutSubNav();
  const meta = META[locale];

  return (
    <PageLayout
      title={t('졸업생 진로')}
      titleSize="xl"
      subNav={subNav}
      padding="none"
      pageTitle={meta.title}
      pageDescription={meta.description}
    >
      <ContentSection tone="white" padding="subNav">
        <LoginVisible allow="ROLE_STAFF">
          <div className="mb-8 text-right">
            <Button
              as="link"
              to={localizedPath('/about/future-careers/description/edit')}
              variant="outline"
              tone="neutral"
              size="md"
            >
              편집
            </Button>
          </div>
        </LoginVisible>
        <HTMLViewer html={data.description} />
        <CareerStat stat={data.stat} />
        <CareerCompanies companies={data.companies} />
      </ContentSection>
    </PageLayout>
  );
}
