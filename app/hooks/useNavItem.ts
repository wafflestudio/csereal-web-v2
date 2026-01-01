import { type NavItem, navigationTree } from '~/constants/navigation';
import { useLanguage } from '~/hooks/useLanguage';

export function useNavItem() {
  const { pathWithoutLocale } = useLanguage();
  const activeItem = findNavItemByPath(navigationTree, pathWithoutLocale);
  return { activeItem };
}

function findNavItemByPath(
  items: NavItem[],
  targetPath: string,
): NavItem | null {
  for (const item of items) {
    if (item.children) {
      const found = findNavItemByPath(item.children, targetPath);
      if (found) return found;
    }
    if (item.path && targetPath.startsWith(item.path)) return item;
  }
  return null;
}
