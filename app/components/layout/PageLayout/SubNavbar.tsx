import { Link, useLocation } from 'react-router';
import Node from '~/components/common/Nodes';
import { useLanguage } from '~/hooks/useLanguage';

export interface SubNavItem {
  name: string;
  path: string;
  depth?: number; // 들여쓰기 깊이 (0, 1, 2...)
}

interface SubNavbarProps {
  title: string;
  titlePath: string;
  items: SubNavItem[];
}

const ITEM_HEIGHT = 33;
const INDENTATION = 16;

export default function SubNavbar({ title, titlePath, items }: SubNavbarProps) {
  const height = `${(items.length + 1) * ITEM_HEIGHT}px`;
  const { localizedPath } = useLanguage();

  return (
    <div className="absolute right-[80px] top-0 hidden h-full sm:block">
      <div
        className="sticky top-[52px] col-start-2 row-span-full mb-8 mt-13 flex"
        style={{ height }}
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

function SubNavItem({ item }: { item: SubNavItem }) {
  const { pathname } = useLocation();
  const { localizedPath } = useLanguage();
  const localizedItemPath = localizedPath(item.path);
  const isCurrent = pathname === localizedItemPath;
  const marginLeft = `${(item.depth || 0) * INDENTATION}px`;

  return (
    <li
      className={`mb-3.5 w-fit text-sm ${
        isCurrent
          ? 'font-bold tracking-wider text-main-orange'
          : 'text-neutral-700'
      }`}
      style={{ marginLeft }}
    >
      <Link
        to={localizedItemPath}
        className="whitespace-nowrap hover:text-main-orange"
      >
        {item.name}
      </Link>
    </li>
  );
}
