import type { BreadcrumbItem } from '~/components/layout/PageLayout';
import { navigationTree } from '~/constants/navigation';
import { useLanguage } from '~/hooks/useLanguage';
import { findPathToItem, useNavItem } from '~/hooks/useNavItem';

// TODO: 입학 > 수시모집이 아닌 입학 > 학부 > 수시모집 으로 뜨게 하기
export function useBreadcrumb(): BreadcrumbItem[] {
  const { activeItem } = useNavItem();
  const { tUnsafe } = useLanguage();

  if (!activeItem) return [];

  const path = findPathToItem(navigationTree, activeItem);
  if (!path) return [];

  return path
    .filter((item) => item.path) // path가 있는 항목만
    .map((item) => ({
      name: tUnsafe(item.key),
      path: item.path,
    }));
}
