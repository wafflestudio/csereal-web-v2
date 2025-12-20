import { type LoaderFunctionArgs, useLoaderData } from 'react-router';
import HTMLViewer from '~/components/common/HTMLViewer';
import PageLayout from '~/components/layout/PageLayout';
import { useLanguage } from '~/hooks/useLanguage';
import { useAboutSubNav } from '~/hooks/useSubNav';
import type { AboutContent } from '~/types/api/v2';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = url.pathname.startsWith('/en') ? 'en' : 'ko';

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
      titleType="big"
      breadcrumb={[
        { name: t('학부 소개'), path: '/about/overview' },
        { name: t('학부장 인사말'), path: '/about/greetings' },
      ]}
      subNav={subNav}
      removePadding
    >
      <GreetingsContent />
    </PageLayout>
  );
}

function GreetingsContent() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="px-5 pb-12 pt-7 sm:py-11 sm:pl-25 sm:pr-[360px]">
      <div className="flex flex-col-reverse items-start gap-6 sm:flex-row sm:gap-10">
        <HTMLViewer
          htmlContent={data.description}
          wrapperClassName="sm:w-[25rem] sm:grow"
        />
        {data.imageURL && (
          <div>
            <img src={data.imageURL} alt="학부장" width={212} height={280} />
          </div>
        )}
      </div>
    </div>
  );
}
