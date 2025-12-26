import type { Route } from '.react-router/types/app/routes/community/news/+types/edit.$id';
import type { LoaderFunctionArgs } from 'react-router';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import type { News } from '~/types/api/v2/news';
import { isLocalFile } from '~/types/form';
import { fetchJson, fetchOk } from '~/utils/fetch';
import { FormData2, getDeleteIds } from '~/utils/form';
import NewsEditor, { type NewsFormData } from './components/NewsEditor';

export async function loader({ params }: LoaderFunctionArgs) {
  const id = Number(params.id);
  const data = await fetchJson<News>(`${BASE_URL}/v2/news/${id}`);
  return { id, data };
}

export default function NewsEditPage({ loaderData }: Route.ComponentProps) {
  const { id, data } = loaderData;
  const navigate = useNavigate();
  const { locale } = useLanguage({});

  const defaultValues: NewsFormData = {
    title: data.title,
    titleForMain: data.titleForMain ?? '',
    description: data.description,
    date: new Date(data.date),
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
    isSlide: data.isSlide,
  };

  const onCancel = () => {
    navigate(`/${locale}/community/news/${id}`);
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
      // TODO: 정확한 date format이?
      date: content.date,
      isPrivate: content.isPrivate,
      isImportant: content.isImportant,
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
      navigate(`/${locale}/community/news/${id}`);
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
      navigate(`/${locale}/community/news`);
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
