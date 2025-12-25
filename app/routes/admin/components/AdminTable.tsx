import clsx from 'clsx';
import dayjs from 'dayjs';
import { Link } from 'react-router';
import Checkbox from '~/components/common/Checkbox';
import { useLanguage } from '~/hooks/useLanguage';
import type { ImportantPreview, SlidePreview } from '~/types/api/v2/admin';

const CATEGORY_PATHS = {
  notice: '/community/notice',
  news: '/community/news',
  seminar: '/community/seminar',
} as const;

const CATEGORY_LABELS: Record<string, string> = {
  notice: '공지사항',
  news: '새 소식',
  seminar: '세미나',
};

const COLUMN_WIDTHS = {
  checkbox: 'w-12.5',
  number: 'w-12.5',
  category: 'w-25',
  date: 'w-37.5',
  edit: 'min-w-17.5',
} as const;

type AdminTableProps = {
  selectedKeys: Set<string>;
  onToggleSelection: (key: string) => void;
} & (
  | { type: 'slide'; posts: SlidePreview[] }
  | { type: 'important'; posts: ImportantPreview[] }
);

export default function AdminTable({
  type,
  posts,
  selectedKeys,
  onToggleSelection,
}: AdminTableProps) {
  const { locale, localizedPath } = useLanguage();

  return (
    <div className="mx-2.5 mb-8">
      {/* Header */}
      <div className="flex items-center border-b border-neutral-300 bg-neutral-50 py-3 text-md font-medium tracking-wide text-neutral-700">
        <div
          className={clsx(
            COLUMN_WIDTHS.checkbox,
            'shrink-0 whitespace-nowrap text-center',
          )}
        >
          선택
        </div>
        <div
          className={clsx(
            COLUMN_WIDTHS.number,
            'shrink-0 whitespace-nowrap text-center',
          )}
        >
          번호
        </div>
        {type === 'important' && (
          <div
            className={clsx(
              COLUMN_WIDTHS.category,
              'shrink-0 whitespace-nowrap text-center',
            )}
          >
            분류
          </div>
        )}
        <div className="min-w-0 flex-1 whitespace-nowrap pl-3 text-left">
          제목
        </div>
        <div
          className={clsx(
            COLUMN_WIDTHS.date,
            'shrink-0 whitespace-nowrap pl-8 text-left',
          )}
        >
          날짜
        </div>
        <div
          className={clsx(
            COLUMN_WIDTHS.edit,
            'shrink-0 whitespace-nowrap pl-3 text-left',
          )}
        >
          편집
        </div>
      </div>

      {/* Body */}
      <ul className="divide-y divide-dashed divide-neutral-200 border-b border-neutral-300">
        {posts.map((post, index) => {
          const key =
            type === 'slide'
              ? post.id.toString()
              : `${(post as ImportantPreview).category}-${post.id}`;
          const isSelected = selectedKeys.has(key);
          const editPath =
            type === 'slide'
              ? `/community/news/edit/${post.id}`
              : // TODO: 좀 더 이쁘게 타입 잡기
                `${CATEGORY_PATHS[(post as ImportantPreview).category]}/edit/${post.id}`;

          return (
            <li
              key={key}
              className={clsx(
                'flex items-center py-3 text-md tracking-wide',
                isSelected && 'bg-neutral-100',
              )}
            >
              {/* 선택 */}
              <div
                className={clsx(
                  COLUMN_WIDTHS.checkbox,
                  'flex shrink-0 justify-center',
                )}
              >
                <Checkbox
                  checked={isSelected}
                  onChange={() => onToggleSelection(key)}
                  className="h-6"
                />
              </div>

              {/* 번호 */}
              <div
                className={clsx(
                  COLUMN_WIDTHS.number,
                  'shrink-0 whitespace-nowrap text-center',
                )}
              >
                {index + 1}
              </div>

              {/* 분류 (important만) */}
              {type === 'important' && (
                <div
                  className={clsx(
                    COLUMN_WIDTHS.category,
                    'shrink-0 whitespace-nowrap text-center',
                  )}
                >
                  {CATEGORY_LABELS[(post as ImportantPreview).category] ||
                    (post as ImportantPreview).category}
                </div>
              )}

              {/* 제목 */}
              <div className="min-w-0 flex-1 pl-3">
                <Link
                  to={localizedPath(
                    type === 'slide'
                      ? `/community/news/${post.id}`
                      : `${CATEGORY_PATHS[(post as ImportantPreview).category]}/${post.id}`,
                  )}
                  className="block overflow-hidden text-ellipsis whitespace-nowrap font-medium hover:underline"
                >
                  {post.title}
                </Link>
              </div>

              {/* 날짜 */}
              <div
                className={clsx(
                  COLUMN_WIDTHS.date,
                  'shrink-0 whitespace-nowrap pl-8',
                )}
              >
                {dayjs(post.createdAt).locale(locale).format('YYYY/MM/DD')}
              </div>

              {/* 편집 */}
              <div
                className={clsx(
                  COLUMN_WIDTHS.edit,
                  'shrink-0 whitespace-nowrap pl-3',
                )}
              >
                <Link
                  to={editPath}
                  className="font-medium text-main-orange hover:underline"
                >
                  편집
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
