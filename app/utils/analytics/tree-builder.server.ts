import type { LogEntry, TreeNode } from '~/types/analytics';

/**
 * 로그 항목들로부터 경로 트리 구조를 생성
 * @param entries 로그 항목 배열
 * @returns 한/영 조회수를 포함한 트리 구조
 */
export function buildTree(entries: LogEntry[]): TreeNode {
  const viewsMap = normalizePageViews(entries);
  const root = buildTreeStructure(viewsMap);
  calculateTotalViews(root);
  sortTreeByViews(root);

  return root;
}

/**
 * /en 경로를 정규화하여 한/영 조회수를 집계
 * @example
 * "/about" -> { ko: 5, en: 0 }
 * "/en/about" -> { ko: 0, en: 3 }
 * 둘 다 "/about"로 정규화되어 { ko: 5, en: 3 }으로 집계됨
 */
function normalizePageViews(
  entries: LogEntry[],
): Map<string, { ko: number; en: number }> {
  const viewsMap = new Map<string, { ko: number; en: number }>();

  for (const entry of entries) {
    const isEnglish = entry.pathname.startsWith('/en/');
    const normalizedPath = isEnglish
      ? entry.pathname.replace('/en', '')
      : entry.pathname;

    if (!viewsMap.has(normalizedPath)) {
      viewsMap.set(normalizedPath, { ko: 0, en: 0 });
    }

    // biome-ignore lint/style/noNonNullAssertion: viewsMap에 반드시 존재
    const views = viewsMap.get(normalizedPath)!;

    if (isEnglish) {
      views.en += 1;
    } else {
      views.ko += 1;
    }
  }

  return viewsMap;
}

/**
 * 경로별 조회수 맵으로부터 트리 구조를 생성
 * @example
 * "/about/overview" -> root.children["about"].children["overview"]
 */
function buildTreeStructure(
  viewsMap: Map<string, { ko: number; en: number }>,
): TreeNode {
  const root: TreeNode = {
    segment: '',
    fullPath: '',
    koViews: 0,
    enViews: 0,
    totalKoViews: 0,
    totalEnViews: 0,
    children: {},
  };

  for (const [path, views] of viewsMap) {
    const segments = path.split('/').filter(Boolean);
    let current = root;
    let pathSoFar = '';

    for (const segment of segments) {
      pathSoFar += `/${segment}`;

      if (!current.children[segment]) {
        current.children[segment] = {
          segment,
          fullPath: pathSoFar,
          koViews: 0,
          enViews: 0,
          totalKoViews: 0,
          totalEnViews: 0,
          children: {},
        };
      }

      current = current.children[segment];
    }

    current.koViews = views.ko;
    current.enViews = views.en;
  }

  return root;
}

/**
 * 트리 노드의 전체 조회수를 재귀적으로 계산
 * 전체 조회수 = 해당 경로의 직접 조회수 + 모든 하위 경로의 조회수 합
 * @returns 계산된 한/영 전체 조회수
 */
function calculateTotalViews(node: TreeNode): { ko: number; en: number } {
  let totalKo = node.koViews;
  let totalEn = node.enViews;

  for (const child of Object.values(node.children)) {
    const childTotals = calculateTotalViews(child);
    totalKo += childTotals.ko;
    totalEn += childTotals.en;
  }

  node.totalKoViews = totalKo;
  node.totalEnViews = totalEn;

  return { ko: totalKo, en: totalEn };
}

/**
 * 트리 전체를 재귀적으로 조회수 내림차순 정렬 (한글 + 영어)
 */
function sortTreeByViews(node: TreeNode): void {
  const sortedEntries = Object.entries(node.children).sort((a, b) => {
    const totalA = a[1].totalKoViews + a[1].totalEnViews;
    const totalB = b[1].totalKoViews + b[1].totalEnViews;
    return totalB - totalA; // 내림차순
  });

  node.children = Object.fromEntries(sortedEntries);

  // 재귀적으로 자식 노드들도 정렬
  for (const child of Object.values(node.children)) {
    sortTreeByViews(child);
  }
}
