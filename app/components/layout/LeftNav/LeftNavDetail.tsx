import type { NavItem } from '~/constants/navigation';
import { useNavItem } from '~/hooks/useNavItem';
import { useStore } from '~/store';
import LNBMenuItem from './LeftNavMenuItem';

export default function LNBDetail() {
  const navbarState = useStore((s) => s.navbarState);

  if (navbarState.type !== 'hovered') return null;

  return (
    <div
      className="no-scrollbar absolute bottom-0 left-0 top-0 z-40 w-132 overflow-y-scroll bg-[#1f2021] pl-59 pt-[9.62rem] backdrop-blur-[2px]"
      role="menu"
      aria-label="서브 네비게이션"
    >
      <NavTree item={navbarState.navItem} />
    </div>
  );
}

interface NavTreeProps {
  item: NavItem;
  depth?: number;
}

function NavTree({ item, depth = 0 }: NavTreeProps) {
  const { activeItem } = useNavItem();
  const childItems = item.children || [];
  const closeNavbar = useStore((s) => s.closeNavbar);

  const isHighlighted =
    activeItem?.path !== undefined &&
    item.path !== undefined &&
    (activeItem.path === item.path ||
      activeItem.path.startsWith(`${item.path}/`));

  return (
    <>
      {depth !== 0 && (
        <LNBMenuItem
          navItem={item}
          highlight={isHighlighted}
          variant="detail"
          onClick={closeNavbar}
        />
      )}
      {childItems.length > 0 && (
        <div className="mb-11 ml-5">
          {childItems.map((child, i) => (
            <NavTree key={i} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </>
  );
}
