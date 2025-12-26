import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { isLocalFile } from '~/types/form';
import { fetchOk } from '~/utils/fetch';
import { FormData2 } from '~/utils/form';
import NewsEditor, { type NewsFormData } from './components/NewsEditor';

export default function NewsCreatePage() {
  const navigate = useNavigate();
  const { locale } = useLanguage({});

  const onCancel = () => {
    navigate(`/${locale}/community/news`);
  };

  const onSubmit = async (content: NewsFormData) => {
    const formData = new FormData2();

    formData.appendJson('request', {
      title: content.title,
      titleForMain: content.titleForMain || null,
      description: content.description,
      // TODO: 정확한 date format이?
      date: content.date,
      isPrivate: content.isPrivate,
      isImportant: content.isImportant,
      isSlide: content.isSlide,
      tags: content.tags,
    });

    formData.appendIfLocal('mainImage', content.image);
    formData.appendIfLocal(
      'attachments',
      content.attachments.filter(isLocalFile),
    );

    try {
      await fetchOk(`${BASE_URL}/v2/news`, {
        method: 'POST',
        body: formData,
      });

      toast.success('새소식을 게시했습니다.');
      navigate(`/${locale}/community/news`);
    } catch {
      toast.error('게시에 실패했습니다.');
    }
  };

  return (
    <PageLayout title="새소식 작성" titleSize="xl" padding="default">
      <NewsEditor onCancel={onCancel} onSubmit={onSubmit} />
    </PageLayout>
  );
}
