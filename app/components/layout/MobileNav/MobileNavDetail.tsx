import { Link } from 'react-router';
import type { NavItem } from '~/constants/navigation';
import { useActiveNavItem } from '~/hooks/useActiveNavItem';
import { useLanguage } from '~/hooks/useLanguage';
import { useStore } from '~/store';
import navbarTranslations from '../LeftNav/translations.json';

export default function MobileNavDetail() {
  const navbarState = useStore((s) => s.navbarState);
  const activeItem = useActiveNavItem();

  if (navbarState.type !== 'hovered') return null;

  return (
    <div className="relative grow-[13.6875] basis-0">
      <div className="no-scrollbar absolute bottom-0 left-0 right-0 top-0 z-40 overflow-y-scroll bg-[#1f2021] pl-10 pt-10">
        <NavTree item={navbarState.navItem} activeItem={activeItem} depth={0} />
      </div>
    </div>
  );
}

interface NavTreeProps {
  item: NavItem;
  activeItem: NavItem | null;
  depth: number;
}

function NavTree({ item, activeItem, depth }: NavTreeProps) {
  const closeNavbar = useStore((s) => s.closeNavbar);
  const childItems = item.children || [];

  return (
    <>
      {depth !== 0 && (
        <MobileNavMenuItem
          navItem={item}
          highlight={activeItem?.path === item.path}
          onClick={closeNavbar}
          depth={depth}
        />
      )}
      {childItems.length > 0 && (
        <div className="mb-11 ml-5">
          {childItems.map((child, i) => (
            <NavTree
              // biome-ignore lint/suspicious/noArrayIndexKey: static nav tree
              key={i}
              item={child}
              activeItem={activeItem}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </>
  );
}

interface MobileNavMenuItemProps {
  navItem: NavItem;
  highlight: boolean;
  onClick: () => void;
  depth: number;
}

function MobileNavMenuItem({
  navItem,
  highlight,
  onClick,
  depth,
}: MobileNavMenuItemProps) {
  const { localizedPath, tUnsafe } = useLanguage(navbarTranslations);
  const to = navItem.path ? localizedPath(navItem.path) : undefined;

  // 번역 및 포맷팅 (괄호 처리)
  const translated = tUnsafe(navItem.key);
  const idx = translated.indexOf('(');
  const label =
    idx === -1 ? (
      translated
    ) : (
      <>
        {translated.slice(0, idx)}
        <span className="text-xs font-medium leading-5">
          {translated.slice(idx)}
        </span>
      </>
    );

  // depth에 따른 스타일
  const containerClassName = depth === 1 ? 'mb-[1.75rem]' : 'mb-[1.5rem]';
  const textSize = depth === 1 ? 'text-md' : 'text-sm';

  if (to) {
    return (
      <div className={containerClassName}>
        <Link
          to={to}
          onClick={onClick}
          className={`block font-medium leading-5 ${textSize} ${
            highlight ? 'text-main-orange' : 'text-white hover:text-main-orange'
          }`}
        >
          {label}
        </Link>
      </div>
    );
  }

  // path가 없으면 카테고리 헤더
  return (
    <div className={containerClassName}>
      <p className={`block font-medium leading-5 text-white ${textSize}`}>
        {label}
      </p>
    </div>
  );
}
