import { useReducer, useState } from 'react';
import { Link, useLocation, useRevalidator } from 'react-router';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import AlertDialog from '~/components/ui/AlertDialog';
import Attachments from '~/components/ui/Attachments';
import Button from '~/components/ui/Button';
import HTMLViewer from '~/components/ui/HTMLViewer';
import { toast } from '~/components/ui/sonner';
import { useLanguage } from '~/hooks/useLanguage';
import type { TimelineContent } from '~/types/api/v2/academics';
import type { ProcessedHtml } from '~/utils/csp';
import { fetchOk } from '~/utils/fetch';
import Timeline from './Timeline';

type ProcessedTimelineContent = Omit<TimelineContent, 'description'> & {
  description: ProcessedHtml;
};

interface TimelineViewerProps<T> {
  contents: T[];
  title: { text: string; unit: string };
  yearLimitCount?: number;
}

export default function TimelineViewer<T extends ProcessedTimelineContent>({
  contents,
  title,
  yearLimitCount = 10,
}: TimelineViewerProps<T>) {
  const { t, tUnsafe } = useLanguage({
    이하: 'or earlier',
    '내용은 없습니다.': 'No content available.',
    '연도 추가': 'Add Year',
  });
  const [selectedYear, setSelectedYear] = useState(contents[0]?.year ?? 0);
  const timeLineYears = contents
    .map((change) => change.year)
    .slice(0, yearLimitCount);
  const yearLimit = timeLineYears.at(-1) ?? 0;
  const selectedContents = getSelectedContents(
    selectedYear,
    yearLimit,
    contents,
    tUnsafe,
  );
  const location = useLocation();
  const pathname = location.pathname;

  if (contents.length === 0) {
    return null;
  }

  return (
    <>
      <LoginVisible allow="ROLE_STAFF">
        <Link
          to={`${pathname}/create`}
          className="mb-7 ml-0.5 flex h-[30px] w-fit items-center rounded-2xl border border-main-orange pl-0.5 pr-2 pt-px text-md text-main-orange duration-200 hover:bg-main-orange hover:text-white"
        >
          <span className="material-symbols-outlined text-xl font-light">
            add
          </span>
          <span className="font-semibold">{t('연도 추가')}</span>
        </Link>
      </LoginVisible>
      <Timeline
        times={timeLineYears}
        selectedTime={selectedYear}
        setSelectedTime={setSelectedYear}
      />
      <div className="mt-7">
        {selectedContents.length === 1 ? (
          <ContentViewer
            description={selectedContents[0].description}
            title={`${selectedContents[0].year}${title.unit} ${title.text}`}
            attachments={selectedContents[0].attachments}
            year={selectedYear}
            pathname={pathname}
          />
        ) : (
          selectedContents.map((change, i) => {
            const isLast = i !== 0 && i === selectedContents.length - 1;
            return (
              <TogglableContentViewer
                description={change.description}
                expandDefault={i === 0}
                title={`${change.year}${title.unit}${isLast ? ` ${t('이하')}` : ''} ${title.text}`}
                attachments={change.attachments}
                year={change.year}
                pathname={pathname}
                key={change.year}
              />
            );
          })
        )}
      </div>
    </>
  );
}

function ActionButtons({ year, pathname }: { year: number; pathname: string }) {
  const { t } = useLanguage({
    삭제: 'Delete',
    편집: 'Edit',
    '삭제하시겠습니까?': 'Are you sure you want to delete?',
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const revalidator = useRevalidator();

  const handleDelete = async () => {
    try {
      await fetchOk(`/api/v2${pathname}/${year}`, { method: 'DELETE' });
      setShowDeleteDialog(false);
      toast.success('삭제에 성공했습니다.');
      revalidator.revalidate();
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  return (
    <>
      <LoginVisible allow="ROLE_STAFF">
        <div className="mt-7 flex justify-end gap-3">
          <Button
            variant="outline"
            tone="neutral"
            onClick={() => setShowDeleteDialog(true)}
          >
            {t('삭제')}
          </Button>
          <Button
            variant="outline"
            tone="neutral"
            as="link"
            to={`${pathname}/edit/${year}`}
          >
            {t('편집')}
          </Button>
        </div>
      </LoginVisible>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        description={t('삭제하시겠습니까?')}
        confirmText={t('삭제')}
        onConfirm={handleDelete}
      />
    </>
  );
}

function ContentViewer({
  description,
  title,
  attachments,
  year,
  pathname,
}: {
  description: ProcessedHtml;
  title: string;
  attachments: TimelineContent['attachments'];
  year: number;
  pathname: string;
}) {
  return (
    <div className="mb-5">
      <div className="mb-4 font-semibold">{title}</div>
      <Attachments files={attachments} />
      <div className="rounded-sm bg-neutral-75 p-5">
        <HTMLViewer html={description} />
      </div>
      <ActionButtons year={year} pathname={pathname} />
    </div>
  );
}

function TogglableContentViewer({
  description,
  expandDefault = false,
  title,
  attachments,
  year,
  pathname,
}: {
  description: ProcessedHtml;
  expandDefault?: boolean;
  title: string;
  attachments: TimelineContent['attachments'];
  year: number;
  pathname: string;
}) {
  const [isExpanded, toggleContent] = useReducer((x) => !x, expandDefault);

  return (
    <div className="mb-5">
      <button
        type="button"
        onClick={toggleContent}
        className="mb-4 flex items-center hover:text-main-orange"
      >
        <span className="material-symbols-outlined text-2xl font-light">
          {isExpanded ? 'expand_less' : 'expand_more'}
        </span>
        <span className="font-semibold">{title}</span>
      </button>
      {isExpanded && (
        <>
          <Attachments files={attachments} />
          <div className="rounded-sm bg-neutral-75 p-5">
            <HTMLViewer html={description} />
          </div>
          <ActionButtons year={year} pathname={pathname} />
        </>
      )}
    </div>
  );
}

const getSelectedContents = <T extends ProcessedTimelineContent>(
  year: number,
  yearLimit: number,
  data: T[],
  t: (key: string) => string,
): T[] | ProcessedTimelineContent[] => {
  if (year <= yearLimit) return data.filter((d) => d.year <= yearLimit);

  const change = data.find((d) => d.year === year);
  return change
    ? [change]
    : [
        {
          year,
          description: {
            html: `${year} ${t('내용은 없습니다.')}`,
            cssRules: [],
            styleKey: '0',
          },
          attachments: [],
        },
      ];
};
