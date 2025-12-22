import type { Route } from '.react-router/types/app/routes/academics/graduate/+types/courses';
import CoursesPage from '~/routes/academics/components/courses/CoursesPage';
import type { Course } from '~/types/api/v2/academics/courses';
import { getLocaleFromPathname } from '~/utils/string';

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const response = await fetch(
    `https://cse.snu.ac.kr/api/v2/academics/courses?studentType=graduate&sort=${locale}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch graduate courses data');
  }
  return (await response.json()) as Course[];
}

export default function GraduateCoursesPage({
  loaderData,
}: Route.ComponentProps) {
  return (
    <CoursesPage courses={loaderData} studentType="graduate" hideSortOption />
  );
}
