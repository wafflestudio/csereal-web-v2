import type { Route } from '.react-router/types/app/routes/community/news/+types/edit.$id';
import dayjs from 'dayjs';
import type { LoaderFunctionArgs } from 'react-router';
import { useNavigate } from 'react-router';
import { toast } from '~/components/ui/sonner';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import type { News } from '~/types/api/v2/news';
import { isLocalFile } from '~/types/form';
import { fetchJson, fetchOk } from '~/utils/fetch';
import { FormData2, getDeleteIds } from '~/utils/form';
import NewsEditor, { type NewsFormData } from './components/NewsEditor';

dayjs.locale('ko');

export async function loader({ params }: LoaderFunctionArgs) {
  const id = Number(params.id);
  const data = await fetchJson<News>(`${BASE_URL}/v2/news/${id}`);
  return { id, data };
}

export default function NewsEditPage({ loaderData }: Route.ComponentProps) {
  const { id, data } = loaderData;
  const navigate = useNavigate();

  const defaultValues: NewsFormData = {
    title: data.title,
    titleForMain: data.titleForMain ?? '',
    description: data.description,
    date: dayjs(data.date, 'YYYY-MM-DD').toDate(),
    image: data.imageURL
      ? { type: 'UPLOADED_IMAGE', url: data.imageURL }
      : null,
    attachments: data.attachments.map((file) => ({
      type: 'UPLOADED_FILE',
      file,
    })),
    tags: data.tags,
    isPrivate: data.isPrivate,
    isImportant: data.isImportant,
    importantUntil: data.importantUntil
      ? dayjs(data.importantUntil, 'YYYY-MM-DD').toDate()
      : null,
    hasImportantUntilDeadline: data.importantUntil !== null,
    isSlide: data.isSlide,
  };

  const onCancel = () => {
    navigate(`/community/news/${id}`);
  };

  const onSubmit = async (content: NewsFormData) => {
    const deleteIds = getDeleteIds({
      prev: defaultValues.attachments,
      cur: content.attachments,
    });

    const formData = new FormData2();

    formData.appendJson('request', {
      title: content.title,
      titleForMain: content.titleForMain || null,
      description: content.description,
      date: content.date.toISOString(),
      isPrivate: content.isPrivate,
      isImportant: content.isImportant,
      importantUntil: content.importantUntil
        ? dayjs(content.importantUntil).format('YYYY-MM-DD')
        : null,
      isSlide: content.isSlide,
      tags: content.tags,
      deleteIds,
      removeImage: defaultValues.image !== null && content.image === null,
    });

    formData.appendIfLocal('newMainImage', content.image);
    formData.appendIfLocal(
      'newAttachments',
      content.attachments.filter(isLocalFile),
    );

    try {
      await fetchOk(`${BASE_URL}/v2/news/${id}`, {
        method: 'PATCH',
        body: formData,
      });

      toast.success('새소식을 수정했습니다.');
      navigate(`/community/news/${id}`);
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  };

  const onDelete = async () => {
    try {
      await fetchOk(`${BASE_URL}/v2/news/${id}`, {
        method: 'DELETE',
      });

      toast.success('새소식을 삭제했습니다.');
      navigate('/community/news');
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  return (
    <PageLayout title="새소식 편집" titleSize="xl" padding="default">
      <NewsEditor
        onCancel={onCancel}
        onSubmit={onSubmit}
        onDelete={onDelete}
        defaultValues={defaultValues}
      />
    </PageLayout>
  );
}
