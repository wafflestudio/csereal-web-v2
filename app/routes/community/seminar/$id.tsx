import type { Route } from '.react-router/types/app/routes/community/seminar/+types/$id';
import dayjs from 'dayjs';
import type { LoaderFunctionArgs } from 'react-router';
import { useNavigate } from 'react-router';
import 'dayjs/locale/ko';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import PageLayout from '~/components/layout/PageLayout';
import Attachments from '~/components/ui/Attachments';
import HTMLViewer from '~/components/ui/HTMLViewer';
import Image from '~/components/ui/Image';
import Node from '~/components/ui/Nodes';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useCommunitySubNav } from '~/hooks/useSubNav';
import PostFooter from '~/routes/community/components/PostFooter';
import type { Seminar } from '~/types/api/v2/seminar';
import { fetchOk } from '~/utils/fetch';
import { stripHtml, truncateDescription } from '~/utils/metadata';
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
  const navigate = useNavigate();

  // 동적 메타데이터 생성
  const pageTitle =
    locale === 'en'
      ? `${seminar.title} | Seminar`
      : `${seminar.title} | 세미나`;

  const pageDescription = seminar.introduction
    ? truncateDescription(stripHtml(seminar.introduction))
    : locale === 'en'
      ? 'Seminar information from the Department of Computer Science and Engineering at Seoul National University.'
      : '서울대학교 컴퓨터공학부 세미나 정보입니다.';

  const handleDelete = async () => {
    try {
      await fetchOk(`${BASE_URL}/v2/seminar/${seminar.id}`, {
        method: 'DELETE',
      });
      toast.success('게시글을 삭제했습니다.');
      navigate(localizedPath('/community/seminar'));
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  return (
    <PageLayout
      title={t('세미나')}
      titleSize="xl"
      pageTitle={pageTitle}
      pageDescription={pageDescription}
      subNav={subNav}
      padding="none"
    >
      <h2 className="px-5 py-9 text-[1.25rem] font-semibold leading-[1.4] sm:pl-[100px] sm:pr-[340px]">
        {seminar.title}
      </h2>
      <div className="bg-neutral-50 px-5 pb-36 pt-9 sm:pl-[100px] sm:pr-[340px]">
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
          {seminar.imageURL && (
            <Image
              alt="대표 이미지"
              src={seminar.imageURL}
              className="object-contain mx-7 aspect-square sm:h-60 sm:w-60"
            />
          )}
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

        <div className="h-10" />

        <Node variant="straight" />

        <PostFooter
          post={seminar}
          listPath="/community/seminar"
          editPath={`/community/seminar/edit/${seminar.id}`}
          onDelete={handleDelete}
        />
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
