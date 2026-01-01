import type { Route } from '.react-router/types/app/routes/about/facilities/+types/index';
import type { LoaderFunctionArgs } from 'react-router';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import Button from '~/components/ui/Button';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAboutSubNav } from '~/hooks/useSubNav';
import type { FacilitiesResponse } from '~/types/api/v2/about/facilities';
import { processHtmlForCsp } from '~/utils/csp';
import { getLocaleFromPathname } from '~/utils/string';
import FacilitiesList from './components/FacilitiesList';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const response = await fetch(`${BASE_URL}/v2/about/facilities`);
  if (!response.ok) throw new Error('Failed to fetch facilities');

  const facilities = (await response.json()) as FacilitiesResponse;
  return facilities.map((facility) => ({
    ...facility[locale],
    description: processHtmlForCsp(facility[locale].description),
  }));
}

const META = {
  ko: {
    title: '시설 안내',
    description:
      '서울대학교 컴퓨터공학부의 주요 시설을 소개합니다. 강의실, 연구실, 세미나실 등 학부 내 다양한 시설 정보를 확인하실 수 있습니다.',
  },
  en: {
    title: 'Facilities',
    description:
      'Facilities of the Department of Computer Science and Engineering at Seoul National University. Find information about classrooms, labs, seminar rooms, and other facilities.',
  },
};

export default function FacilitiesPage({
  loaderData: facilities,
}: Route.ComponentProps) {
  const { t, localizedPath, locale } = useLanguage({
    '시설 안내': 'Facilities',
  });
  const subNav = useAboutSubNav();
  const meta = META[locale];

  return (
    <PageLayout
      title={t('시설 안내')}
      titleSize="xl"
      subNav={subNav}
      pageTitle={meta.title}
      pageDescription={meta.description}
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-7 text-right">
          <Button
            as="link"
            to={localizedPath('/about/facilities/create')}
            variant="solid"
            tone="brand"
            size="md"
          >
            시설 추가
          </Button>
        </div>
      </LoginVisible>
      <FacilitiesList facilities={facilities} />
    </PageLayout>
  );
}
