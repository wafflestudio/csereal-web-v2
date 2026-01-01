import { useState } from 'react';
import { useRevalidator } from 'react-router';
import { toast } from '~/components/ui/sonner';
import AlertDialog from '~/components/ui/AlertDialog';
import Button from '~/components/ui/Button';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { fetchOk } from '~/utils/fetch';

interface AdminFeaturesProps {
  selectedIds: Set<number>;
  isEditMode: boolean;
  toggleEditMode: () => void;
}

export default function AdminFeatures({
  selectedIds,
  isEditMode,
  toggleEditMode,
}: AdminFeaturesProps) {
  const { localizedPath } = useLanguage();
  const revalidator = useRevalidator();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUnpinDialog, setShowUnpinDialog] = useState(false);

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;

    try {
      await fetchOk(`${BASE_URL}/v2/notice`, {
        method: 'DELETE',
        body: JSON.stringify({ idList: Array.from(selectedIds) }),
        headers: { 'Content-Type': 'application/json' },
      });

      toast.success('선택된 공지를 삭제했습니다.');
      revalidator.revalidate();
    } catch {
      toast.error('공지를 삭제하지 못했습니다.');
    }
    setShowDeleteDialog(false);
  };

  const handleBatchUnpin = async () => {
    if (selectedIds.size === 0) return;

    try {
      await fetchOk(`${BASE_URL}/v2/notice`, {
        method: 'PATCH',
        body: JSON.stringify({ idList: Array.from(selectedIds) }),
        headers: { 'Content-Type': 'application/json' },
      });

      toast.success('선택된 공지를 고정 해제했습니다.');
      revalidator.revalidate();
    } catch {
      toast.error('공지를 고정 해제하지 못했습니다.');
    }
    setShowUnpinDialog(false);
  };

  return (
    <>
      <div className="mx-2.5 mt-12 flex">
        {isEditMode && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="material-symbols-rounded text-lg font-extralight text-neutral-500">
                check_box
              </span>
              <span className="text-sm tracking-wide text-neutral-500">
                {selectedIds.size}개 게시물 선택
              </span>
            </div>
            <Button
              variant="outline"
              tone="neutral"
              size="sm"
              disabled={selectedIds.size === 0}
              onClick={() => setShowDeleteDialog(true)}
            >
              일괄 삭제
            </Button>
            <Button
              variant="outline"
              tone="neutral"
              size="sm"
              disabled={selectedIds.size === 0}
              onClick={() => setShowUnpinDialog(true)}
            >
              일괄 고정 해제
            </Button>
          </div>
        )}
        <div className="ml-auto flex items-center">
          <Button
            variant="solid"
            tone="brand"
            size="md"
            onClick={toggleEditMode}
          >
            {isEditMode ? '완료' : '편집'}
          </Button>
          <span className="ml-4">
            {isEditMode ? (
              <Button variant="solid" tone="inverse" size="md" disabled>
                새 게시글
              </Button>
            ) : (
              <Button
                variant="solid"
                tone="inverse"
                size="md"
                as="link"
                to={localizedPath('/community/notice/create')}
              >
                새 게시글
              </Button>
            )}
          </span>
        </div>
      </div>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        description="선택한 게시글을 모두 삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={handleBatchDelete}
      />

      <AlertDialog
        open={showUnpinDialog}
        onOpenChange={setShowUnpinDialog}
        description="선택한 게시글을 모두 고정 해제하시겠습니까?"
        confirmText="고정 해제"
        onConfirm={handleBatchUnpin}
      />
    </>
  );
}
