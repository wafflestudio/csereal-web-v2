import { useState } from 'react';
import { useRevalidator, useSearchParams } from 'react-router';
import { toast } from '~/components/ui/sonner';
import AlertDialog from '~/components/ui/AlertDialog';
import Button from '~/components/ui/Button';
import Pagination from '~/components/ui/Pagination';
import { BASE_URL } from '~/constants/api';
import { useSetToggle } from '~/hooks/useSetToggle';
import type { SlidePreview } from '~/types/api/v2/admin';
import { fetchOk } from '~/utils/fetch';
import AdminTable from './AdminTable';

const POST_LIMIT = 40;

interface SlideManagementProps {
  slides: SlidePreview[];
  total: number;
}

export default function SlideManagement({
  slides,
  total,
}: SlideManagementProps) {
  const revalidator = useRevalidator();
  const [searchParams] = useSearchParams();
  const { selected: selectedKeys, toggle: toggleSelection } =
    useSetToggle<string>();
  const [showDialog, setShowDialog] = useState(false);

  const pageNum = parseInt(searchParams.get('pageNum') || '1', 10);
  const totalPages = Math.ceil(total / POST_LIMIT);

  const handleBatchUnslide = async () => {
    try {
      const newsIdList = Array.from(selectedKeys).map((key) =>
        parseInt(key, 10),
      );
      await fetchOk(`${BASE_URL}/v2/admin/slide`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsIdList }),
      });
      toast.success('슬라이드를 해제했습니다.');
      revalidator.revalidate();
    } catch {
      toast.error('슬라이드를 해제하지 못했습니다.');
    }
    setShowDialog(false);
  };

  return (
    <div>
      <span className="mb-5 ml-6 block text-sm tracking-wide text-neutral-500">
        총 {total}개의 게시물
      </span>

      <AdminTable
        type="slide"
        posts={slides}
        selectedKeys={selectedKeys}
        onToggleSelection={toggleSelection}
      />

      <Pagination page={pageNum} totalPages={totalPages} />

      <div className="ml-6 mt-12 flex items-center gap-4">
        <div className="flex items-center gap-1">
          <span className="material-symbols-rounded text-lg font-extralight text-neutral-500">
            check_box
          </span>
          <span className="text-sm tracking-wide text-neutral-500">
            {selectedKeys.size}개 게시물 선택
          </span>
        </div>
        <Button
          variant="outline"
          tone="neutral"
          size="sm"
          disabled={selectedKeys.size === 0}
          onClick={() => setShowDialog(true)}
        >
          일괄 슬라이드 해제
        </Button>
      </div>

      <AlertDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        description="정말 선택된 슬라이드를 모두 해제하시겠습니까?"
        confirmText="해제"
        onConfirm={handleBatchUnslide}
      />
    </div>
  );
}
