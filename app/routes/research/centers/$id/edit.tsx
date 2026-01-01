import type { Route } from '.react-router/types/app/routes/research/centers/$id/+types/edit';
import type { LoaderFunctionArgs } from 'react-router';
import { useNavigate } from 'react-router';
import { toast } from '~/components/ui/sonner';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import type { ResearchCenter } from '~/types/api/v2/research/centers';
import { fetchJson, fetchOk } from '~/utils/fetch';
import { FormData2 } from '~/utils/form';
import ResearchCenterEditor, {
  type ResearchCenterFormData,
} from '../components/ResearchCenterEditor';

interface ResearchCenterData {
  ko: ResearchCenter;
  en: ResearchCenter;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id!;

  const data = await fetchJson<ResearchCenterData>(
    `${BASE_URL}/v2/research/${id}`,
  );

  return data;
}

export default function ResearchCenterEdit({
  loaderData,
}: Route.ComponentProps) {
  const { ko, en } = loaderData;
  const navigate = useNavigate();
  const { locale } = useLanguage({});

  const defaultValues: ResearchCenterFormData = {
    ko: {
      name: ko.name,
      websiteURL: ko.websiteURL,
      description: ko.description,
      type: 'centers',
    },
    en: {
      name: en.name,
      websiteURL: en.websiteURL,
      description: en.description,
      type: 'centers',
    },
    image: ko.mainImageUrl
      ? { type: 'UPLOADED_IMAGE', url: ko.mainImageUrl }
      : null,
  };

  const onCancel = () => {
    navigate(`/${locale}/research/centers`);
  };

  const onSubmit = async (formData: ResearchCenterFormData) => {
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

      toast.success('연구 센터를 수정했습니다.');
      navigate(`/${locale}/research/centers`);
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  };

  return (
    <PageLayout title="연구 센터 편집" titleSize="xl" padding="default">
      <ResearchCenterEditor
        defaultValues={defaultValues}
        onCancel={onCancel}
        onSubmit={onSubmit}
      />
    </PageLayout>
  );
}
