import type { Route } from '.react-router/types/app/routes/admin/analytics/+types/index';
import PageLayout from '~/components/layout/PageLayout';
import {
  getDayFiles,
  getMonthFolders,
  readLogEntries,
} from '~/utils/analytics-reader.server';

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const selectedFile = url.searchParams.get('file');

  const months = await getMonthFolders();

  // 최근 3개월의 파일 목록만
  const filesPerMonth = await Promise.all(
    months.slice(0, 3).map(async (month) => ({
      month,
      files: await getDayFiles(month),
    })),
  );

  // 선택된 파일의 로그 읽기
  const logs = selectedFile ? await readLogEntries(selectedFile) : null;

  return {
    filesPerMonth,
    logs: logs?.map((log) => ({ timestamp: log.timestamp, url: log.url })),
    selectedFile,
  };
}

export default function AnalyticsPage({ loaderData }: Route.ComponentProps) {
  if (!loaderData) {
    return (
      <PageLayout title="접속 통계" titleSize="xl">
        <p>로그인이 필요합니다.</p>
      </PageLayout>
    );
  }

  const { filesPerMonth, logs, selectedFile } = loaderData;

  return (
    <PageLayout title="접속 통계" titleSize="xl">
      {/* 파일 목록 */}
      <div>
        <h2 className="mb-4 font-bold">로그 파일 (최근 3개월)</h2>
        {filesPerMonth.length === 0 ? (
          <p className="text-neutral-500">로그 파일이 없습니다.</p>
        ) : (
          <div className="space-y-6">
            {filesPerMonth.map(({ month, files }) => (
              <div key={month}>
                <h3 className="mb-2 font-semibold">{month}</h3>
                {files.length === 0 ? (
                  <p className="ml-4 text-neutral-500">파일 없음</p>
                ) : (
                  <ul className="ml-4 space-y-1">
                    {files.map((file) => (
                      <li key={file.name} className="flex items-center gap-3">
                        <a
                          href={`/admin/analytics?file=${encodeURIComponent(file.path)}`}
                          className={
                            selectedFile === file.path
                              ? 'font-bold text-main-orange'
                              : 'text-main-orange hover:underline'
                          }
                        >
                          {file.name}
                        </a>
                        <span className="text-sm text-neutral-400">
                          ({formatFileSize(file.size)})
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 로그 뷰어 */}
      <div className="mt-10">
        <div className="overflow-x-auto">
          <table className="border-collapse text-sm">
            <thead>
              <tr className="border-b bg-neutral-100">
                <th className="px-3 py-2 text-left">시간</th>
                <th className="px-3 py-2 text-left">URL</th>
              </tr>
            </thead>
            <tbody>
              {logs?.map((log, index) => (
                <tr key={index} className="border-b hover:bg-neutral-50">
                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                    {new Date(log.timestamp).toLocaleString('ko-KR')}
                  </td>
                  <td className="px-3 py-2 max-w-md truncate" title={log.url}>
                    {new URL(log.url).pathname}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}
