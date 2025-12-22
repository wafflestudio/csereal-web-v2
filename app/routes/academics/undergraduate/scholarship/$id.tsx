import type { Route } from '.react-router/types/app/routes/academics/undergraduate/scholarship/+types/$id';
import type { LoaderFunctionArgs } from 'react-router';
import HTMLViewer from '~/components/common/HTMLViewer';
import PageLayout from '~/components/layout/PageLayout';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import type {
  Scholarship,
  ScholarshipWithLanguage,
} from '~/types/api/v2/academics/scholarship';

interface ScholarshipAPIResponse {
  first: Scholarship;
  second: Scholarship;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id;
  if (!id) {
    throw new Error('Scholarship ID is required');
  }

  const response = await fetch(
    `https://cse.snu.ac.kr/api/v2/academics/scholarship/${id}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch scholarship data');
  }

  const data = (await response.json()) as ScholarshipAPIResponse;

  // Normalize to WithLanguage format
  const isFirstKo = data.first.language === 'ko';
  const scholarship: ScholarshipWithLanguage = isFirstKo
    ? { ko: data.first, en: data.second }
    : { ko: data.second, en: data.first };

  return scholarship;
}

export default function UndergraduateScholarshipDetailPage({
  loaderData,
}: Route.ComponentProps) {
  const { t, locale } = useLanguage();
  const subNav = useAcademicsSubNav();

  const scholarship = loaderData[locale];

  // 타이틀이 긴 경우 정규표현식으로 괄호 내부 내용을 제거
  // ex) 교외장학금 (현송문화재단, 유한재단, ...) -> 교외장학금
  const shortTitle =
    scholarship.name.length > 20
      ? scholarship.name.replace(/\([^)]*\)/g, '')
      : scholarship.name;

  const breadcrumb = [
    { path: '/academics', name: t('학사 및 교과') },
    { name: t('학부') },
    {
      path: '/academics/undergraduate/scholarship',
      name: t('장학 제도'),
    },
  ];

  return (
    <PageLayout
      title={shortTitle}
      titleSize="xl"
      breadcrumb={breadcrumb}
      subNav={subNav}
    >
      <HTMLViewer html={scholarship.description} />
    </PageLayout>
  );
}
