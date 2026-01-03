import type { Route } from '.react-router/types/app/routes/admin/analytics/+types/index';
import dayjs from 'dayjs';
import PageLayout from '~/components/layout/PageLayout';
import { type NavItem, navigationTree } from '~/constants/navigation';
import type { PageStats } from '~/types/analytics';
import {
  getAvailableDates,
  getDailyStats,
} from '~/utils/analytics/stats-reader.server';

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const date = url.searchParams.get('date') || dayjs().format('YYYY-MM-DD');

  const stats = await getDailyStats(date);
  const availableDates = await getAvailableDates();

  return { stats, date, availableDates };
}

export default function AnalyticsPage({ loaderData }: Route.ComponentProps) {
  const { stats, date, availableDates } = loaderData;

  return (
    <PageLayout title="접속 통계" titleSize="xl">
      {/* 날짜 선택 */}
      <form
        method="get"
        className="mb-8 rounded-lg border border-neutral-300 bg-white p-6"
      >
        <div className="flex items-center gap-3">
          <select
            name="date"
            defaultValue={date}
            className="rounded border border-neutral-300 px-3 py-2"
          >
            {availableDates.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded bg-main-orange px-4 py-2 text-white hover:bg-main-orange/90"
          >
            조회
          </button>
        </div>
      </form>

      {!stats && <p className="text-neutral-500">통계 없음</p>}

      {stats && (
        <>
          {/* 요약 */}
          <div className="mb-8 grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-neutral-300 bg-white p-6">
              <div className="text-sm text-neutral-600">총 조회수</div>
              <div className="mt-2 text-3xl font-bold">
                {stats.total.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg border border-neutral-300 bg-white p-6">
              <div className="text-sm text-neutral-600">실 사용자</div>
              <div className="mt-2 text-3xl font-bold text-main-orange">
                {stats.realUsers.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg border border-neutral-300 bg-white p-6">
              <div className="text-sm text-neutral-600">봇</div>
              <div className="mt-2 text-3xl font-bold text-neutral-400">
                {stats.bots.toLocaleString()}
              </div>
            </div>
          </div>

          {/* 페이지별 (navigationTree 순서) */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold">페이지별 접속자수</h2>
            <PagesTable pages={stats.pages} />
          </section>

          {/* 브라우저 분포 */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold">브라우저 분포</h2>
            <StatsTable data={stats.browsers} />
          </section>

          {/* OS 분포 */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold">OS 분포</h2>
            <StatsTable data={stats.os} />
          </section>

          {/* 플랫폼 분포 */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold">플랫폼 분포</h2>
            <StatsTable data={stats.platforms} />
          </section>

          {/* Referer 순위 */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold">Referer 순위</h2>
            <StatsTable data={stats.referers} />
          </section>
        </>
      )}
    </PageLayout>
  );
}

// === Helper Components ===

function PagesTable({ pages }: { pages: PageStats[] }) {
  const sorted = sortByNavigationTree(pages);
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-300 bg-white">
      <table className="w-full">
        <thead className="bg-neutral-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">경로</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">
              조회수
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {sorted.map((p) => (
            <tr key={p.path} className="hover:bg-neutral-50">
              <td className="px-4 py-3 text-sm">{p.path}</td>
              <td className="px-4 py-3 text-right text-sm font-medium">
                {p.views.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatsTable({
  data,
}: {
  data: Array<{ name: string; count: number; percentage: number }>;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-300 bg-white">
      <table className="w-full">
        <thead className="bg-neutral-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">이름</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">개수</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">비율</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {data.map((d) => (
            <tr key={d.name} className="hover:bg-neutral-50">
              <td className="px-4 py-3 text-sm">{d.name}</td>
              <td className="px-4 py-3 text-right text-sm font-medium">
                {d.count.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right text-sm">
                {d.percentage.toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// === Sorting ===

function sortByNavigationTree(pages: PageStats[]): PageStats[] {
  const order = flattenNavigationTree(navigationTree);
  const orderMap = new Map(order.map((path, index) => [path, index]));

  return pages.sort((a, b) => {
    const aIndex = orderMap.get(a.path) ?? 9999;
    const bIndex = orderMap.get(b.path) ?? 9999;
    return aIndex - bIndex;
  });
}

function flattenNavigationTree(tree: NavItem[]): string[] {
  const paths: string[] = [];

  function walk(items: NavItem[]) {
    for (const item of items) {
      if (item.path) {
        paths.push(item.path);
      }
      if (item.children) {
        walk(item.children);
      }
    }
  }

  walk(tree);
  return paths;
}
