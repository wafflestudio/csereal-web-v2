import clsx from 'clsx';
import { Link, useLocation } from 'react-router';
import Node from '~/components/ui/Nodes';
import { useLanguage } from '~/hooks/useLanguage';
import type { SubNavConfig, SubNavConfigItem } from '~/hooks/useSubNav';

// TODO: 더 나은 방법
const heightMap = [
  'h-[33px]',
  'h-[66px]',
  'h-[99px]',
  'h-[132px]',
  'h-[165px]',
  'h-[198px]',
  'h-[231px]',
  'h-[264px]',
  'h-[297px]',
  'h-[330px]',
  'h-[363px]',
  'h-[396px]',
  'h-[429px]',
  'h-[462px]',
];

export default function SubNavbar({ title, titlePath, items }: SubNavConfig) {
  const { localizedPath } = useLanguage();

  return (
    <div className="absolute right-[80px] top-0 hidden h-full sm:block">
      <div
        className={clsx(
          'sticky top-[52px] col-start-2 row-span-full mb-8 mt-13 flex',
          // 예약 페이지는 20개
          items.length === 20 ? 'h-[692px]' : heightMap[items.length],
        )}
      >
        <Node variant="curvedVertical" />
        <div className="pl-1.5 pt-2.75">
          <Link
            to={localizedPath(titlePath)}
            className="text-neutral-800 hover:text-main-orange"
          >
            <h3 className="inline whitespace-nowrap text-base font-semibold">
              {title}
            </h3>
          </Link>
          <ul className="mt-4">
            {items.map((item, index) => (
              <SubNavItem key={`${item.path}-${index}`} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const marginLeftMap = ['ml-0', 'ml-4', 'ml-8'];

function SubNavItem({ item }: { item: SubNavConfigItem }) {
  const { localizedPath } = useLanguage();
  const { pathname } = useLocation();
  const localizedItemPath = item.path ? localizedPath(item.path) : undefined;
  const isCurrent =
    localizedItemPath !== undefined && pathname.startsWith(localizedItemPath);
  const marginLeft = marginLeftMap[item.depth || 0];

  return (
    <li
      className={clsx(
        'mb-3.5 w-fit text-sm',
        marginLeft,
        isCurrent
          ? 'font-bold tracking-wider text-main-orange'
          : 'text-neutral-700',
      )}
    >
      {localizedItemPath ? (
        <Link
          to={localizedItemPath}
          className={'whitespace-nowrap hover:text-main-orange'}
        >
          <NavLabel text={item.name} />
        </Link>
      ) : (
        <span className={'whitespace-nowrap'}>
          <NavLabel text={item.name} />
        </span>
      )}
    </li>
  );
}

function NavLabel({ text }: { text: string }) {
  const idx = text.indexOf('(');
  if (idx === -1) return text;

  return (
    <>
      {text.slice(0, idx)}
      <span className="text-xs font-medium leading-5">{text.slice(idx)}</span>
    </>
  );
}
