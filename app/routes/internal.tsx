import type { Route } from '.react-router/types/app/routes/+types/internal';
import HTMLViewer from '~/components/common/HTMLViewer';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';

export const loader = async () => {
  const response = await fetch(`${BASE_URL}/v2/internal`);
  const data = (await response.json()) as { description: string };
  return data;
};

export default function InternalPage({ loaderData }: Route.ComponentProps) {
  return (
    <PageLayout title="학부 메일링리스트" titleSize="xl">
      <HTMLViewer html={loaderData.description} />
    </PageLayout>
  );
}
