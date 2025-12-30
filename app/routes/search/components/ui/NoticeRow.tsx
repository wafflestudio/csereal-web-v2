import dayjs from 'dayjs';
import { Link } from 'react-router';
import { useLanguage } from '~/hooks/useLanguage';
import RangeBolded from './RangeBolded';

interface NoticeRowProps {
  id: number;
  title: string;
  partialDescription: string;
  boldStartIndex: number;
  boldEndIndex: number;
  dateStr: string;
}

export default function NoticeRow({
  id,
  title,
  dateStr,
  ...description
}: NoticeRowProps) {
  const { localizedPath } = useLanguage();
  const date = dayjs(dateStr);

  return (
    <Link
      className="flex flex-col gap-[.62rem]"
      to={localizedPath(`/community/notice/${id}`)}
    >
      <h3 className="text-base font-bold leading-none text-neutral-950">
        {title}
      </h3>
      <RangeBolded {...description} />
      <time className="text-md font-medium leading-none text-main-orange hover:cursor-text">
        {date.format('YYYY/M/D')}
      </time>
    </Link>
  );
}
