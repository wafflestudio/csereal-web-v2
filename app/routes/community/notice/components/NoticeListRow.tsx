import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { Link, useSearchParams } from 'react-router';
import { useLanguage } from '~/hooks/useLanguage';
import type { NoticePreview } from '~/types/api/v2/notice';
import ClipIcon from '../assets/clip.svg?react';
import LockIcon from '../assets/lock.svg?react';
import PinIcon from '../assets/pin.svg?react';

interface NoticeListRowProps {
  post: NoticePreview;
}

export const NOTICE_ROW_CELL_WIDTH = {
  pin: 'sm:w-[3.125rem]',
  title: 'sm:w-[18.75rem]',
  date: 'sm:w-auto sm:min-w-[7.125rem]',
} as const;

export default function NoticeListRow({ post }: NoticeListRowProps) {
  const [searchParams] = useSearchParams();

  return (
    <li
      className={`flex flex-col gap-2.5 px-7 py-6 text-md sm:h-11 sm:flex-row sm:items-center sm:gap-0 sm:px-0 sm:py-2.5 ${
        post.isPinned && 'font-semibold'
      } ${post.isPrivate ? 'bg-neutral-200' : 'odd:bg-neutral-50'}`}
    >
      <PrivateOrPinCell isPrivate={post.isPrivate} isPinned={post.isPinned} />
      <TitleCell
        title={post.title}
        hasAttachment={post.hasAttachment}
        id={post.id}
        isPinned={post.isPinned}
        pageNum={searchParams.get('pageNum')}
      />
      <DateCell date={post.createdAt} />
    </li>
  );
}

function PrivateOrPinCell({
  isPrivate,
  isPinned,
}: {
  isPrivate: boolean;
  isPinned: boolean;
}) {
  return (
    <span
      className={`${NOTICE_ROW_CELL_WIDTH.pin} ${
        !(isPrivate || isPinned) && 'hidden sm:inline-flex'
      } shrink-0 sm:px-3.25`}
    >
      {isPrivate ? <LockIcon /> : isPinned && <PinIcon />}
    </span>
  );
}

interface TitleCellProps {
  title: string;
  hasAttachment: boolean;
  id: number;
  isPinned: boolean;
  pageNum: string | null;
}

function TitleCell({
  title,
  hasAttachment,
  id,
  isPinned,
  pageNum,
}: TitleCellProps) {
  const { locale } = useLanguage({});
  const detailPath = pageNum
    ? `/${locale}/community/notice/${id}?pageNum=${pageNum}`
    : `/${locale}/community/notice/${id}`;

  return (
    <span className={`${NOTICE_ROW_CELL_WIDTH.title} min-w-0 grow sm:pl-3`}>
      <Link
        to={detailPath}
        className="flex items-center gap-1.5 font-semibold sm:font-normal"
      >
        <span
          className={`${
            isPinned && 'font-semibold text-main-orange sm:text-neutral-800'
          } overflow-hidden text-ellipsis text-base tracking-wide hover:text-main-orange sm:whitespace-nowrap sm:text-md`}
        >
          {title}
        </span>
        {hasAttachment && <ClipIcon className="shrink-0" />}
      </Link>
    </span>
  );
}

function DateCell({ date }: { date: string }) {
  const { locale } = useLanguage({});

  return (
    <span
      className={`${NOTICE_ROW_CELL_WIDTH.date} tracking-wide sm:pl-8 sm:pr-10`}
    >
      {dayjs(date).locale(locale).format('YYYY/M/DD')}
    </span>
  );
}
