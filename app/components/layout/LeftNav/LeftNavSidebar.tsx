import { Link } from 'react-router';
import { IS_PROD } from '~/constants/api';
import { navigationTree } from '~/constants/navigation';
import { useLanguage } from '~/hooks/useLanguage';
import { useNavItem } from '~/hooks/useNavItem';
import { useStore } from '~/store';
import DotEmpty from './assets/dot_empty.svg?react';
import DotFill from './assets/dot_fill.svg?react';
import SnuLogo from './assets/SNU_Logo.svg?react';
import LNBMenuItem from './LeftNavMenuItem';

export const NAVBAR_CLOSED_WIDTH_REM = 6.25;
export const NAVBAR_EXPANDED_WIDTH_REM = 11;

export default function LNBSidebar() {
  const navbarState = useStore((s) => s.navbarState);
  const expandNavbar = useStore((s) => s.expandNavbar);
  const { pathWithoutLocale } = useLanguage();

  const isMain = pathWithoutLocale === '/';

  // Expand navbar if: hovered, explicitly expanded, or on main page
  const isExpanded = navbarState.type !== 'closed' || isMain;

  return (
    <nav
      className={`no-scrollbar z-50 flex flex-col items-center overflow-scroll bg-[#323235] py-[2.88rem] transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-44' : 'w-25'
      }`}
      onMouseEnter={expandNavbar}
      aria-label="주 네비게이션"
    >
      <Logo />
      {isExpanded ? <NavList /> : <DotList />}
    </nav>
  );
}

const logoTranslations = {
  '메인으로 이동': 'Go to home',
};

function Logo() {
  const { localizedPath, t } = useLanguage(logoTranslations);
  const homePath = localizedPath('/');

  return (
    <Link to={homePath} aria-label={t('메인으로 이동')} className="relative">
      <SnuLogo
        className={!IS_PROD ? 'fill-main-orange' : 'fill-white'}
        width="56"
        height="58"
        viewBox="0 0 45 47"
      />
      {!IS_PROD && (
        <div className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono font-bold">
          beta
        </div>
      )}
    </Link>
  );
}

function DotList() {
  const { activeItem } = useNavItem();

  const isDotFilled = (item: (typeof navigationTree)[0]) => {
    if (!activeItem) return false;
    return item.path?.startsWith(activeItem.path || '') ?? false;
  };

  const dotArr = navigationTree.map(isDotFilled);

  const getDotMargin = (filled: boolean, idx: number) => {
    if (dotArr[idx + 1]) return 'mb-[2.2rem]';
    return filled ? 'mb-[2.2rem]' : 'mb-[2.7rem]';
  };

  return (
    <div
      className={`flex flex-col items-center ${
        dotArr[0] ? 'mt-[2.7rem]' : 'mt-[3.38rem]'
      }`}
      role="presentation"
      aria-hidden="true"
    >
      {dotArr.map((filled, idx) =>
        filled ? (
          <DotFill key={idx} className={getDotMargin(filled, idx)} />
        ) : (
          <DotEmpty key={idx} className={getDotMargin(filled, idx)} />
        ),
      )}
    </div>
  );
}

function NavList() {
  const navbarState = useStore((s) => s.navbarState);
  const { activeItem } = useNavItem();
  const hoverNavItem = useStore((s) => s.hoverNavItem);

  const shouldHighlight = (item: (typeof navigationTree)[0]) => {
    if (navbarState.type === 'hovered') {
      return item.key === navbarState.navItem.key;
    }
    return activeItem
      ? (item.path?.startsWith(activeItem.path || '') ?? false)
      : false;
  };

  return (
    <ul className="mx-12 mt-12 flex flex-col gap-9 text-center">
      {navigationTree.map((item, i) => (
        <LNBMenuItem
          key={i}
          navItem={item}
          highlight={shouldHighlight(item)}
          variant="sidebar"
          onHover={() => hoverNavItem(item)}
        />
      ))}
    </ul>
  );
}
