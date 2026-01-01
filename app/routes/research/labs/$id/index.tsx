import type { Route } from '.react-router/types/app/routes/research/labs/$id/+types/index';
import type { LoaderFunctionArgs } from 'react-router';
import { Link } from 'react-router';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import Button from '~/components/ui/Button';
import CornerFoldedRectangle from '~/components/ui/CornerFoldedRectangle';
import HTMLViewer from '~/components/ui/HTMLViewer';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useResearchSubNav } from '~/hooks/useSubNav';
import type { ResearchLabWithLanguage } from '~/types/api/v2/research/labs';
import { processHtmlForCsp } from '~/utils/csp';
import { stripHtml, truncateDescription } from '~/utils/metadata';
import { encodeParam, getLocaleFromPathname } from '~/utils/string';
import PentagonLong from '../assets/pentagon_long.svg?react';
import PentagonShort from '../assets/pentagon_short.svg?react';

export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const id = Number(params.id);

  if (!id || Number.isNaN(id)) {
    throw new Response('Invalid ID', { status: 400 });
  }

  const response = await fetch(`${BASE_URL}/v2/research/lab/${id}`);

  if (!response.ok) {
    throw new Response('Not Found', { status: 404 });
  }

  const data = (await response.json()) as ResearchLabWithLanguage;

  return {
    ...data[locale],
    description: processHtmlForCsp(data[locale].description),
  };
}

export default function ResearchLabDetailPage({
  loaderData: lab,
}: Route.ComponentProps) {
  const { t, localizedPath, locale } = useLanguage({
    '연구실 목록': 'Laboratories',
    연구·교육: 'Research & Edu',
    스트림: 'Stream',
    교수: 'Professor',
    랩실: 'Lab',
    전화: 'Tel',
  });
  const subNav = useResearchSubNav();

  // 메타데이터 생성
  const pageTitle =
    locale === 'en' ? `${lab.name} | Research Lab` : `${lab.name} | 연구실`;

  const professorNames = lab.professors.map((p) => p.name).join(', ');
  const pageDescription = lab.description?.html
    ? truncateDescription(stripHtml(lab.description.html))
    : locale === 'en'
      ? `${lab.name} research laboratory${professorNames ? ` - Professor: ${professorNames}` : ''}`
      : `${lab.name} 연구실${professorNames ? ` - 교수: ${professorNames}` : ''}`;

  const researchLabInfo = (
    <LabSummary
      lab={lab}
      localizedPath={localizedPath}
      labels={{
        professor: t('교수'),
        lab: t('랩실'),
        tel: t('전화'),
      }}
    />
  );

  return (
    <PageLayout
      title={lab.name}
      titleSize="lg"
      subNav={subNav}
      pageTitle={pageTitle}
      pageDescription={pageDescription}
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-9 text-right">
          <Button
            as="link"
            to={localizedPath(`/research/labs/${lab.id}/edit`)}
            variant="outline"
            tone="neutral"
            size="md"
          >
            편집
          </Button>
        </div>
      </LoginVisible>

      {lab.group && (
        <StreamLink
          groupName={lab.group.name}
          localizedPath={localizedPath}
          label={t('스트림')}
        />
      )}
      <div className={lab.group ? 'mt-6' : ''}>
        <div className="mx-2 mb-6 flex justify-end sm:hidden sm:mb-0">
          {researchLabInfo}
        </div>
        <HTMLViewer
          html={lab.description}
          component={
            <div className="hidden sm:float-right sm:block">
              {researchLabInfo}
            </div>
          }
        />
      </div>
    </PageLayout>
  );
}

function LabSummary({
  lab,
  localizedPath,
  labels,
}: {
  lab: ProcessedLab;
  localizedPath: (path: string) => string;
  labels: { professor: string; lab: string; tel: string };
}) {
  return (
    <CornerFoldedRectangle
      colorTheme="black"
      size="large"
      shadow="light"
      margin="sm:mt-[-64px] sm:mb-11 sm:ml-11"
    >
      <ul className="flex h-40 w-60 flex-col gap-1 px-6 py-5">
        <li className="flex gap-1 text-sm">
          <span className="whitespace-nowrap">
            {labels.professor}:{' '}
            {lab.professors.map((info, index) => (
              <span key={info.id}>
                <Link
                  to={localizedPath(`/people/faculty/${info.id}`)}
                  className="hover:text-main-orange"
                >
                  {info.name}
                </Link>
                {index !== lab.professors.length - 1 && ', '}
              </span>
            ))}
          </span>
        </li>
        <li className="flex gap-1 text-sm">
          <span className="whitespace-nowrap">{labels.lab}: </span>
          <span>{lab.location ?? '-'}</span>
        </li>
        <li className="flex grow gap-1 text-sm">
          <span className="whitespace-nowrap">
            {labels.tel}: {lab.tel ?? '-'}
          </span>
        </li>
        {lab.websiteURL && (
          <li>
            <a
              href={lab.websiteURL}
              className="mt-auto w-fit text-sm underline hover:text-main-orange"
              target="_blank"
              rel="noopener noreferrer"
            >
              Website
            </a>
          </li>
        )}
      </ul>
    </CornerFoldedRectangle>
  );
}

type ProcessedLab = Omit<ResearchLabWithLanguage['ko'], 'description'> & {
  description: import('~/utils/csp').ProcessedHtml;
};

function StreamLink({
  groupName,
  localizedPath,
  label,
}: {
  groupName: string;
  localizedPath: (path: string) => string;
  label: string;
}) {
  const LENGTH_BOUNDARY = 10;
  const width =
    groupName.length < LENGTH_BOUNDARY ? 'w-[10.875rem]' : 'w-[16.4375rem]';
  const affiliatedGroupPath = localizedPath(
    `/research/groups?selected=${encodeParam(groupName)}`,
  );

  return (
    <div className="relative w-fit">
      <Link
        to={affiliatedGroupPath}
        className={`absolute ${width} peer flex h-10 items-center justify-center pr-1 text-center text-sm duration-300 hover:text-white`}
      >
        <span className="tracking-[-0.019em]">
          {groupName} {label}
        </span>
      </Link>
      <div className="text-white peer-hover:text-main-orange">
        {groupName.length < LENGTH_BOUNDARY ? (
          <PentagonShort className="duration-300" />
        ) : (
          <PentagonLong className="duration-300" />
        )}
      </div>
    </div>
  );
}
