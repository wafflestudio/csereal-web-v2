import type { Route } from '.react-router/types/app/routes/people/faculty/+types';
import type { LoaderFunctionArgs } from 'react-router';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { usePeopleSubNav } from '~/hooks/useSubNav';
import type { FacultyList, SimpleFaculty } from '~/types/api/v2/professor';
import { getLocaleFromPathname } from '~/utils/string';
import PeopleGrid, {
  type PeopleCardContentItem,
  type PeopleCardProps,
} from '../components/PeopleGrid';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const response = await fetch(
    `${BASE_URL}/v2/professor/active?language=${locale}`,
  );
  if (!response.ok) throw new Error('Failed to fetch faculty list');

  return (await response.json()) as FacultyList;
}

export default function FacultyPage({
  loaderData: data,
}: Route.ComponentProps) {
  const { t, localizedPath } = useLanguage({
    교수진: 'Faculty',
    구성원: 'People',
    객원교수: 'Visiting Professors',
  });
  const subNav = usePeopleSubNav();

  const normal = data.professors
    .filter((professor) => professor.status !== 'VISITING')
    .map((professor) => toCard(professor, localizedPath));
  const visiting = data.professors
    .filter((professor) => professor.status === 'VISITING')
    .map((professor) => toCard(professor, localizedPath));

  return (
    <PageLayout
      title={t('교수진')}
      titleSize="xl"
      breadcrumb={[
        { name: t('구성원'), path: '/people' },
        { name: t('교수진'), path: '/people/faculty' },
      ]}
      subNav={subNav}
    >
      <PeopleGrid items={normal} />
      {visiting.length > 0 && (
        <>
          <h3 className="mb-4 mt-12 text-[20px] font-bold">{t('객원교수')}</h3>
          <PeopleGrid items={visiting} />
        </>
      )}
    </PageLayout>
  );
}

const toCard = (
  professor: SimpleFaculty,
  localizedPath: (path: string) => string,
): PeopleCardProps => {
  const content: PeopleCardContentItem[] = [];

  if (professor.labName && professor.labId) {
    content.push({
      text: professor.labName,
      href: localizedPath(`/research/labs/${professor.labId}`),
    });
  }

  if (professor.phone) content.push({ text: professor.phone });

  if (professor.email) {
    content.push({ text: professor.email, href: `mailto:${professor.email}` });
  }

  return {
    id: professor.id,
    imageURL: professor.imageURL,
    name: professor.name,
    subtitle: professor.academicRank,
    href: localizedPath(`/people/faculty/${professor.id}`),
    content,
  };
};
