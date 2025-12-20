import { type LoaderFunctionArgs, useLoaderData } from 'react-router';
import ContentSection from '~/components/common/ContentSection';
import HTMLViewer from '~/components/common/HTMLViewer';
import PageLayout from '~/components/layout/PageLayout';
import { useLanguage } from '~/hooks/useLanguage';
import { useAboutSubNav } from '~/hooks/useSubNav';
import type { AboutContent } from '~/types/api/v2';
import { getLocaleFromPathname } from '~/utils/string';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);

  const response = await fetch(
    `https://cse.snu.ac.kr/api/v2/about/greetings?language=${locale}`,
  );
  if (!response.ok) throw new Error('Failed to fetch greetings');

  return (await response.json()) as AboutContent;
}

export default function GreetingsPage() {
  const { t } = useLanguage();
  const subNav = useAboutSubNav();

  return (
    <PageLayout
      title={t('학부장 인사말')}
      titleSize="xl"
      breadcrumb={[
        { name: t('학부 소개'), path: '/about/overview' },
        { name: t('학부장 인사말'), path: '/about/greetings' },
      ]}
      subNav={subNav}
      padding="none"
    >
      <GreetingsContent />
    </PageLayout>
  );
}

function GreetingsContent() {
  const data = useLoaderData<typeof loader>();

  return (
    <ContentSection tone="white" padding="subNav">
      <div className="flex flex-col-reverse items-start gap-6 sm:flex-row sm:gap-10">
        <div className="sm:w-[25rem] sm:grow">
          <HTMLViewer html={data.description} />
        </div>
        {data.imageURL && (
          <div>
            <img src={data.imageURL} alt="학부장" width={212} height={280} />
          </div>
        )}
      </div>
    </ContentSection>
  );
}
