import { navigationTree } from '~/constants/navigation';
import { useLanguage } from '~/hooks/useLanguage';
import { useStore } from '~/store';
import MenuSVG from './assets/menu.svg?react';

export default function MobileNavButton() {
  const navbarState = useStore((s) => s.navbarState);
  const hoverNavItem = useStore((s) => s.hoverNavItem);
  const closeNavbar = useStore((s) => s.closeNavbar);
  const { pathWithoutLocale } = useLanguage();

  const topLevelNavItem = navigationTree.find(
    (item) => item.path && pathWithoutLocale.startsWith(item.path),
  );

  const isOpen = navbarState.type !== 'closed';

  const toggleNav = () => {
    if (isOpen) {
      closeNavbar();
    } else {
      const itemToOpen = topLevelNavItem || navigationTree[0]; // 기본값: 첫 번째 카테고리
      hoverNavItem(itemToOpen);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleNav}
      className="flex items-center justify-center sm:hidden"
      aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
    >
      {isOpen ? (
        <span className="material-symbols-rounded text-white">close</span>
      ) : (
        <MenuSVG />
      )}
    </button>
  );
}
