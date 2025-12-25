import type { Route } from '.react-router/types/app/routes/community/seminar/+types/$id';
import dayjs from 'dayjs';
import type { LoaderFunctionArgs } from 'react-router';
import 'dayjs/locale/ko';
import type { ReactNode } from 'react';
import Attachments from '~/components/common/Attachments';
import Button from '~/components/common/Button';
import HTMLViewer from '~/components/common/HTMLViewer';
import Image from '~/components/common/Image';
import LoginVisible from '~/components/common/LoginVisible';
import Node from '~/components/common/Nodes';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useCommunitySubNav } from '~/hooks/useSubNav';
import PostFooter from '~/routes/community/components/PostFooter';
import type { Seminar } from '~/types/api/v2/seminar';
import { getLocaleFromPathname } from '~/utils/string';

export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const id = Number(params.id);

  if (!id || Number.isNaN(id)) {
    throw new Response('Invalid ID', { status: 400 });
  }

  const searchParams = new URLSearchParams();
  searchParams.append('language', locale);

  const pageNum = url.searchParams.get('pageNum');
  if (pageNum) searchParams.append('pageNum', pageNum);

  const response = await fetch(
    `${BASE_URL}/v2/seminar/${id}?${searchParams.toString()}`,
  );

  if (!response.ok) {
    throw new Response('Not Found', { status: 404 });
  }

  return (await response.json()) as Seminar;
}

export default function SeminarDetailPage({
  loaderData: seminar,
}: Route.ComponentProps) {
  const { t, locale, localizedPath } = useLanguage({
    세미나: 'Seminars',
    소식: 'Community',
    이름: 'Name',
    소속: 'Affiliation',
    주최: 'Host',
    날짜: 'Date',
    위치: 'Location',
    직함: 'Title',
    요약: 'Summary',
    '연사 소개': 'Speaker Introduction',
  });
  const subNav = useCommunitySubNav();

  return (
    <PageLayout
      title={t('세미나')}
      titleSize="xl"
      breadcrumb={[
        { name: t('소식'), path: '/community' },
        { name: t('세미나'), path: '/community/seminar' },
      ]}
      subNav={subNav}
      padding="none"
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="px-5 pt-9 text-right sm:pl-[100px] sm:pr-[340px]">
          <Button
            as="link"
            to={localizedPath(`/community/seminar/edit/${seminar.id}`)}
            variant="outline"
            tone="neutral"
            size="md"
          >
            편집
          </Button>
        </div>
      </LoginVisible>
      <h2 className="px-5 py-9 text-[1.25rem] font-semibold leading-[1.4] sm:pl-[100px] sm:pr-[340px]">
        {seminar.title}
      </h2>
      <div className="bg-neutral-50 px-5 pb-16 pt-9 sm:pl-[100px] sm:pr-[340px]">
        <Attachments files={seminar.attachments} />
        <div className="mb-9 flex flex-col-reverse justify-between gap-5 text-md sm:flex-row">
          <div className="flex flex-col gap-3">
            <div>
              {t('이름')}:{' '}
              <LinkOrText href={seminar.speakerURL}>{seminar.name}</LinkOrText>
            </div>
            {seminar.speakerTitle && (
              <p>
                {t('직함')}: {seminar.speakerTitle}
              </p>
            )}
            <div>
              {t('소속')}:{' '}
              <LinkOrText href={seminar.affiliationURL}>
                {seminar.affiliation}
              </LinkOrText>
            </div>
            <div className="mt-10">
              {t('주최')}: {seminar.host}
            </div>
            <div>
              {t('날짜')}:{' '}
              {formatStartEndDate(seminar.startDate, seminar.endDate, locale)}
            </div>
            <div>
              {t('위치')}: {seminar.location}
            </div>
          </div>
          <div className="relative mx-7 aspect-square sm:h-60 sm:w-60">
            {seminar.imageURL && (
              <Image
                alt="대표 이미지"
                src={seminar.imageURL}
                className="h-full w-full object-contain"
              />
            )}
          </div>
        </div>

        {seminar.description && (
          <>
            <div className="mt-10 font-bold">{t('요약')}</div>
            <HTMLViewer html={seminar.description} />
          </>
        )}

        {seminar.introduction && (
          <>
            <div className="mt-10 font-bold">{t('연사 소개')}</div>
            <HTMLViewer html={seminar.introduction} />
          </>
        )}

        <Node variant="straight" />

        <PostFooter post={seminar} listPath="/community/seminar" />
      </div>
    </PageLayout>
  );
}

const LinkOrText = ({
  href,
  children,
}: {
  href: string | null;
  children: ReactNode;
}) => {
  if (!href) return <span className="inline">{children}</span>;

  return (
    <a
      className="text-link hover:underline"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

const formatStartEndDate = (
  startDateStr: string,
  endDateStr: string | null,
  locale: string,
) => {
  const startDate = dayjs(startDateStr).locale(locale);

  if (!endDateStr) {
    if (startDate.hour() === 0 && startDate.minute() === 0) {
      return startDate.format('YYYY/M/DD');
    }
    return startDate.format('YYYY/M/DD A hh:mm');
  }

  const endDate = dayjs(endDateStr).locale(locale);

  if (startDate.isSame(endDate, 'day')) {
    return `${startDate.format('YYYY/M/DD A hh:mm')} - ${endDate.format('A hh:mm')}`;
  }

  return `${startDate.format('YYYY/M/DD A hh:mm')} - ${endDate.format('YYYY/M/DD A hh:mm')}`;
};
