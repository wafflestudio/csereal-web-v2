import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { isLocalFile } from '~/types/form';
import { fetchOk } from '~/utils/fetch';
import { FormData2 } from '~/utils/form';
import NoticeEditor, { type NoticeFormData } from './components/NoticeEditor';

export default function NoticeCreatePage() {
  const navigate = useNavigate();
  const { locale } = useLanguage({});

  const onCancel = () => {
    navigate(`/${locale}/community/notice`);
  };

  const onSubmit = async (content: NoticeFormData) => {
    const formData = new FormData2();

    formData.appendJson('request', {
      title: content.title,
      titleForMain: content.titleForMain || null,
      description: content.description,
      isPrivate: content.isPrivate,
      isPinned: content.isPinned,
      isImportant: content.isImportant,
      tags: content.tags,
    });

    formData.appendIfLocal(
      'attachments',
      content.attachments.filter(isLocalFile),
    );

    try {
      await fetchOk(`${BASE_URL}/v2/notice`, {
        method: 'POST',
        body: formData,
      });

      toast.success('공지사항을 게시했습니다.');
      navigate(`/${locale}/community/notice`);
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
