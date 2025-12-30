import { Link } from 'react-router';
import { useLanguage } from '~/hooks/useLanguage';
import RangeBolded from './RangeBolded';

type BasicRowProps = {
  href: string;
  title: string;
  partialDescription: string;
  boldStartIndex: number;
  boldEndIndex: number;
  metaLabel: string;
  metaHref: string;
};

export default function BasicRow({
  href,
  title,
  metaLabel,
  metaHref,
  ...description
}: BasicRowProps) {
  const { localizedPath } = useLanguage();

  return (
    <div className="ml-5 flex flex-col gap-2 sm:gap-2.5">
      <Link
        to={localizedPath(href)}
        className="text-base font-bold hover:underline"
      >
        {title}
      </Link>
      <RangeBolded {...description} />
      <Link
        className="text-md font-medium text-main-orange hover:underline"
        to={localizedPath(metaHref)}
      >
        {metaLabel}
      </Link>
    </div>
  );
}
