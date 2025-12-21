import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import PeopleInfoList from '~/routes/people/components/PeopleInfoList';
import PeopleLabNode from '~/routes/people/components/PeopleLabNode';
import PeopleProfileInfo from '~/routes/people/components/PeopleProfileInfo';
import type { Faculty, WithLanguage } from '~/types/api/v2/professor';
import { getLocaleFromPathname } from '~/utils/string';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);

  const id = Number(params.id);
  if (Number.isNaN(id)) throw new Error('Invalid faculty id');

  const response = await fetch(`${BASE_URL}/v2/professor/${id}`);
  if (!response.ok) throw new Error('Failed to fetch faculty');

  const data = (await response.json()) as WithLanguage<Faculty>;
  return data[locale];
}

export default function FacultyDetailPage() {
  const faculty = useLoaderData<typeof loader>();
  const { t } = useLanguage({
    학력: 'Education',
    '연구 분야': 'Research Areas',
    경력: 'Career',
    교수진: 'Faculty',
    구성원: 'People',
  });

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
      titleSize="xl"
      breadcrumb={[
        { name: t('구성원'), path: '/people' },
        { name: t('교수진'), path: '/people/faculty' },
      ]}
    >
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
