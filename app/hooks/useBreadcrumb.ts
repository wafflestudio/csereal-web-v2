import type { BreadcrumbItem } from '~/components/layout/PageLayout';
import { type NavItem, navigationTree } from '~/constants/navigation';
import { useLanguage } from '~/hooks/useLanguage';
import { useNavItem } from '~/hooks/useNavItem';

// TODO: 입학 > 수시모집이 아닌 입학 > 학부 > 수시모집 으로 뜨게 하기
export function useBreadcrumb(): BreadcrumbItem[] {
  const { activeItem } = useNavItem();
  const { tUnsafe } = useLanguage();

  if (!activeItem) return [];

  const path = findPathToItem(navigationTree, activeItem);
  if (!path) return [];

  return path.map((item) => ({
    name: tUnsafe(item.key),
    path: item.path,
  }));
}

// 특정 항목까지의 경로(루트→타겟)를 찾음
function findPathToItem(
  items: NavItem[],
  target: NavItem,
  acc: NavItem[] = [],
): NavItem[] | null {
  for (const item of items) {
    const newPath = [...acc, item];
    if (item.path === target.path) return newPath;
    if (item.children) {
      const found = findPathToItem(item.children, target, newPath);
      if (found) return found;
    }
  }
  return null;
}
