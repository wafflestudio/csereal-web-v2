import type { Route } from '.react-router/types/app/routes/community/seminar/+types/edit.$id';
import type { LoaderFunctionArgs } from 'react-router';
import { useNavigate } from 'react-router';
import { toast } from '~/components/ui/sonner';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import type { Seminar } from '~/types/api/v2/seminar';
import { isLocalFile } from '~/types/form';
import { fetchJson, fetchOk } from '~/utils/fetch';
import { FormData2, getDeleteIds } from '~/utils/form';
import SeminarEditor, {
  type SeminarFormData,
} from './components/SeminarEditor';

export async function loader({ params }: LoaderFunctionArgs) {
  const id = Number(params.id);
  const data = await fetchJson<Seminar>(`${BASE_URL}/v2/seminar/${id}`);
  return { id, data };
}

export default function SeminarEditPage({ loaderData }: Route.ComponentProps) {
  const { id, data } = loaderData;
  const navigate = useNavigate();
  const { locale } = useLanguage({});

  const defaultValues: SeminarFormData = {
    title: data.title,
    titleForMain: data.titleForMain ?? '',
    description: data.description ?? '',
    location: data.location,
    startDate: new Date(data.startDate),
    endDate: data.endDate ? new Date(data.endDate) : null,
    host: data.host ?? '',
    name: data.name ?? '',
    speakerURL: data.speakerURL ?? '',
    speakerTitle: data.speakerTitle ?? '',
    affiliation: data.affiliation ?? '',
    affiliationURL: data.affiliationURL ?? '',
    introduction: data.introduction ?? '',
    image: data.imageURL
      ? { type: 'UPLOADED_IMAGE', url: data.imageURL }
      : null,
    attachments: data.attachments.map((file) => ({
      type: 'UPLOADED_FILE',
      file,
    })),
    isPrivate: data.isPrivate,
    isImportant: data.isImportant,
    isEndDateVisible: data.endDate !== null,
  };

  const onCancel = () => {
    navigate(`/${locale}/community/seminar/${id}`);
  };

  const onSubmit = async (content: SeminarFormData) => {
    const deleteIds = getDeleteIds({
      prev: defaultValues.attachments,
      cur: content.attachments,
    });

    const formData = new FormData2();

    formData.appendJson('request', {
      title: content.title,
      titleForMain: content.titleForMain || null,
      description: content.description || null,
      location: content.location,
      startDate: content.startDate.toISOString(),
      endDate: content.endDate ? content.endDate.toISOString() : null,
      host: content.host || null,
      name: content.name || null,
      speakerURL: content.speakerURL || null,
      speakerTitle: content.speakerTitle || null,
      affiliation: content.affiliation || null,
      affiliationURL: content.affiliationURL || null,
      introduction: content.introduction || null,
      isPrivate: content.isPrivate,
      isImportant: content.isImportant,
      deleteIds,
      removeImage: defaultValues.image !== null && content.image === null,
    });

    formData.appendIfLocal('newMainImage', content.image);
    formData.appendIfLocal(
      'newAttachments',
      content.attachments.filter(isLocalFile),
    );

    try {
      await fetchOk(`${BASE_URL}/v2/seminar/${id}`, {
        method: 'PATCH',
        body: formData,
      });

      toast.success('세미나를 수정했습니다.');
      navigate(`/${locale}/community/seminar/${id}`);
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  };

  const onDelete = async () => {
    try {
      await fetchOk(`${BASE_URL}/v2/seminar/${id}`, {
        method: 'DELETE',
      });

      toast.success('세미나를 삭제했습니다.');
      navigate(`/${locale}/community/seminar`);
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  return (
    <PageLayout title="세미나 편집" titleSize="xl" padding="default">
      <SeminarEditor
        onCancel={onCancel}
        onSubmit={onSubmit}
        onDelete={onDelete}
        defaultValues={defaultValues}
      />
    </PageLayout>
  );
}
