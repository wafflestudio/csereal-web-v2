import type { Route } from '.react-router/types/app/routes/people/faculty/+types/$id';
import type { LoaderFunctionArgs } from 'react-router';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import Button from '~/components/ui/Button';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { usePeopleSubNav } from '~/hooks/useSubNav';
import PeopleInfoList from '~/routes/people/components/PeopleInfoList';
import PeopleLabNode from '~/routes/people/components/PeopleLabNode';
import PeopleProfileInfo from '~/routes/people/components/PeopleProfileInfo';
import type { Faculty } from '~/types/api/v2/professor';
import { getLocaleFromPathname } from '~/utils/string';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);

  const id = Number(params.id);
  if (Number.isNaN(id)) throw new Error('Invalid faculty id');

  const response = await fetch(`${BASE_URL}/v2/professor/${id}`);
  if (!response.ok) throw new Error('Failed to fetch faculty');

  const data = (await response.json()) as { ko: Faculty; en: Faculty };
  return data[locale];
}

export default function FacultyDetailPage({
  loaderData: faculty,
}: Route.ComponentProps) {
  const { t, localizedPath, locale } = useLanguage({
    학력: 'Education',
    '연구 분야': 'Research Areas',
    경력: 'Career',
    교수진: 'Faculty',
    구성원: 'People',
  });
  const subNav = usePeopleSubNav();

  // 동적 메타데이터 생성
  const pageTitle =
    locale === 'en' ? `${faculty.name} | Faculty` : `${faculty.name} | 교수진`;

  const researchAreasText = faculty.researchAreas.join(', ');
  const pageDescription =
    locale === 'en'
      ? `${faculty.name}, ${faculty.academicRank}${researchAreasText ? ` - Research Areas: ${researchAreasText}` : ''}`
      : `${faculty.name} ${faculty.academicRank}${researchAreasText ? ` - 연구 분야: ${researchAreasText}` : ''}`;

  const contactItems = [
    { icon: 'distance', label: faculty.office },
    { icon: 'phone_in_talk', label: faculty.phone },
    { icon: 'print', label: faculty.fax },
    {
      icon: 'mail',
      label: faculty.email,
      href: faculty.email ? `mailto:${faculty.email}` : undefined,
    },
    { icon: 'captive_portal', label: faculty.website, href: faculty.website },
  ];

  return (
    <PageLayout
      title={faculty.name}
      subtitle={faculty.academicRank}
      subNav={subNav}
      titleSize="xl"
      pageTitle={pageTitle}
      pageDescription={pageDescription}
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-9 text-right">
          <Button
            as="link"
            to={localizedPath(`/people/faculty/${faculty.id}/edit`)}
            variant="outline"
            tone="neutral"
            size="md"
          >
            편집
          </Button>
        </div>
      </LoginVisible>

      <div className="relative mb-10 sm:flow-root">
        <PeopleProfileInfo imageURL={faculty.imageURL} items={contactItems} />
        <PeopleLabNode faculty={faculty} />
        <div className="mt-8 break-all">
          <PeopleInfoList header={t('학력')} items={faculty.educations} />
          <PeopleInfoList
            header={t('연구 분야')}
            items={faculty.researchAreas}
          />
          <PeopleInfoList header={t('경력')} items={faculty.careers} />
        </div>
      </div>
    </PageLayout>
  );
}
