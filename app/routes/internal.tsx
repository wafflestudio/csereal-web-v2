import type { Route } from '.react-router/types/app/routes/+types/internal';
import PageLayout from '~/components/layout/PageLayout';
import HTMLViewer from '~/components/ui/HTMLViewer';
import { BASE_URL } from '~/constants/api';
import { processHtmlForCsp } from '~/utils/csp';

export const loader = async () => {
  const response = await fetch(`${BASE_URL}/v2/internal`);
  const data = (await response.json()) as { description: string };
  return { description: processHtmlForCsp(data.description) };
};

export default function InternalPage({ loaderData }: Route.ComponentProps) {
  return (
    <PageLayout title="학부 메일링리스트" titleSize="xl">
      <HTMLViewer html={loaderData.description} />
    </PageLayout>
  );
}
