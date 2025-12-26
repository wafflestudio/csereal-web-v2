import type { Route } from '.react-router/types/app/routes/research/groups/$id/+types/edit';
import type { LoaderFunctionArgs } from 'react-router';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import type { ResearchGroup } from '~/types/api/v2/research/groups';
import { fetchJson, fetchOk } from '~/utils/fetch';
import { FormData2 } from '~/utils/form';
import ResearchGroupEditor, {
  type ResearchGroupFormData,
} from '../components/ResearchGroupEditor';

interface ResearchGroupData {
  ko: ResearchGroup;
  en: ResearchGroup;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id!;

  const data = await fetchJson<ResearchGroupData>(
    `${BASE_URL}/v2/research/${id}`,
  );

  return data;
}

export default function ResearchGroupEdit({
  loaderData,
}: Route.ComponentProps) {
  const { ko, en } = loaderData;
  const navigate = useNavigate();
  const { locale } = useLanguage({});

  const defaultValues: ResearchGroupFormData = {
    ko: { name: ko.name, description: ko.description, type: 'groups' },
    en: { name: en.name, description: en.description, type: 'groups' },
    image: ko.mainImageUrl
      ? { type: 'UPLOADED_IMAGE', url: ko.mainImageUrl }
      : null,
  };

  const onCancel = () => {
    navigate(`/${locale}/research/groups`);
  };

  const onSubmit = async (formData: ResearchGroupFormData) => {
    const data = new FormData2();

    const removeImage = defaultValues.image !== null && formData.image === null;

    data.appendJson('request', {
      ko: { ...formData.ko, removeImage },
      en: { ...formData.en, removeImage },
    });
    data.appendIfLocal('newMainImage', formData.image);

    try {
      await fetchOk(`/api/v2/research/${ko.id}/${en.id}`, {
        method: 'PUT',
        body: data,
      });

      toast.success('연구 스트림을 수정했습니다.');
      navigate(`/${locale}/research/groups`);
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  };

  return (
    <PageLayout title="연구 스트림 편집" titleSize="xl" padding="default">
      <ResearchGroupEditor
        defaultValues={defaultValues}
        onCancel={onCancel}
        onSubmit={onSubmit}
      />
    </PageLayout>
  );
}
