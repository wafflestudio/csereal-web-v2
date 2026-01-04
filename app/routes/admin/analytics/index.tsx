import type { Route } from '.react-router/types/app/routes/admin/analytics/+types/index';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import PageLayout from '~/components/layout/PageLayout';
import Button from '~/components/ui/Button';
import type { TreeNode } from '~/types/analytics';
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
      <form method="get" className="mb-8">
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
          <Button type="submit" size="lg" variant="solid" tone="brand">
            조회
          </Button>
        </div>
      </form>

      {(!stats || stats.total === 0) && (
        <p className="text-neutral-500">통계 없음</p>
      )}

      {stats && stats.total > 0 && (
        <>
          {/* 요약 */}
          <div className="mb-8">
            <div className="text-sm text-neutral-600">총 조회수</div>
            <div className="mt-2 text-3xl font-bold">
              {stats.total.toLocaleString()}
            </div>
          </div>

          {/* 페이지별 (navigationTree 순서) */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold">페이지별 접속자수</h2>
            <PagesTable tree={stats.tree} />
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

function PagesTable({ tree }: { tree: TreeNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-300 bg-white">
      <table className="w-full">
        <thead className="bg-neutral-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">경로</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">
              한글 조회수
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold">
              영어 조회수
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {Object.values(tree.children).map((child) => (
            <TreeNodeRow key={child.fullPath} node={child} depth={0} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TreeNodeRow({ node, depth }: { node: TreeNode; depth: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = Object.keys(node.children).length > 0;
  const indent = `${depth * 1.5}rem`;

  return (
    <>
      <tr
        className="cursor-pointer bg-neutral-50 hover:bg-neutral-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <td
          className="px-4 py-3 text-sm font-medium"
          ref={(ref) => {
            if (ref) {
              ref.style.paddingLeft = indent;
            }
          }}
        >
          <span
            className={clsx(
              'text-neutral-600 h-4 w-4 mr-2 inline-block',
              hasChildren ? '' : 'opacity-0',
            )}
          >
            {isOpen ? (
              <ChevronDown strokeWidth={1.5} />
            ) : (
              <ChevronRight strokeWidth={1.5} />
            )}
          </span>
          {node.fullPath}
        </td>
        <td className="px-4 py-3 text-right text-sm font-semibold">
          {node.totalKoViews.toLocaleString()}
        </td>
        <td className="px-4 py-3 text-right text-sm font-semibold">
          {node.totalEnViews.toLocaleString()}
        </td>
      </tr>
      {hasChildren &&
        isOpen &&
        Object.values(node.children).map((child) => (
          <TreeNodeRow key={child.fullPath} node={child} depth={depth + 1} />
        ))}
    </>
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
