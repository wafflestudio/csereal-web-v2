import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import { toast } from '~/components/ui/sonner';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { isLocalFile } from '~/types/form';
import { fetchOk } from '~/utils/fetch';
import { FormData2 } from '~/utils/form';
import NoticeEditor, { type NoticeFormData } from './components/NoticeEditor';

export default function NoticeCreatePage() {
  const navigate = useNavigate();

  const onCancel = () => {
    navigate('/community/notice');
  };

  const onSubmit = async (content: NoticeFormData) => {
    const formData = new FormData2();

    formData.appendJson('request', {
      title: content.title,
      titleForMain: content.titleForMain || null,
      description: content.description,
      isPrivate: content.isPrivate,
      isPinned: content.isPinned,
      pinnedUntil: content.pinnedUntil
        ? dayjs(content.pinnedUntil).format('YYYY-MM-DD')
        : null,
      isImportant: content.isImportant,
      importantUntil:
        dayjs(content.importantUntil).format('YYYY-MM-DD') ?? null,
      tags: content.tags,
    });

    formData.appendIfLocal(
      'attachments',
      content.attachments.filter(isLocalFile),
    );

    try {
      const response = await fetchOk(`${BASE_URL}/v2/notice`, {
        method: 'POST',
        body: formData,
      });

      const { id } = await response.json();
      toast.success('공지사항을 게시했습니다.');
      navigate(`/community/notice/${id}`);
    } catch {
      toast.error('게시에 실패했습니다.');
    }
  };

  return (
    <PageLayout title="공지사항 작성" titleSize="xl" padding="default">
      <NoticeEditor onCancel={onCancel} onSubmit={onSubmit} />
    </PageLayout>
  );
}
