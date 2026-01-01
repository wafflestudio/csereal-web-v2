import type { Route } from '.react-router/types/app/routes/people/emeritus-faculty/+types/edit.$id';
import type { LoaderFunctionArgs } from 'react-router';
import { useNavigate } from 'react-router';
import { toast } from '~/components/ui/sonner';

import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import FacultyEditor, {
  type FacultyFormData,
} from '~/routes/people/components/FacultyEditor';
import type { Faculty } from '~/types/api/v2/professor';
import type { SimpleResearchLab } from '~/types/api/v2/research/labs';
import { fetchJson, fetchOk } from '~/utils/fetch';
import { FormData2 } from '~/utils/form';

export async function loader({ params }: LoaderFunctionArgs) {
  const id = parseInt(params.id!, 10);

  const [faculty, labsKo, labsEn] = await Promise.all([
    fetchJson<{ ko: Faculty; en: Faculty }>(`${BASE_URL}/v2/professor/${id}`),
    fetchJson<SimpleResearchLab[]>(`${BASE_URL}/v2/research/lab?language=ko`),
    fetchJson<SimpleResearchLab[]>(`${BASE_URL}/v2/research/lab?language=en`),
  ]);

  return {
    faculty,
    labs: { ko: labsKo, en: labsEn },
  };
}

export default function EmeritusFacultyEdit({
  loaderData,
}: Route.ComponentProps) {
  const { faculty, labs } = loaderData;
  const navigate = useNavigate();

  const defaultValues = {
    status: faculty.ko.status,
    ko: faculty.ko,
    en: faculty.en,
  };

  const onSubmit = async (content: FacultyFormData) => {
    const formData = new FormData2();
    const removeImage =
      defaultValues.ko?.imageURL !== null && content.ko.image === null;

    formData.appendJson('request', {
      ko: {
        ...content.ko,
        status: content.status,
        image: undefined,
        startDate: content.ko.startDate.toISOString(),
        endDate: content.ko.endDate.toISOString(),
        removeImage,
      },
      en: {
        ...content.en,
        status: content.status,
        image: undefined,
        startDate: content.en.startDate.toISOString(),
        endDate: content.en.endDate.toISOString(),
        removeImage,
      },
    });
    formData.appendIfLocal('newMainImage', content.ko.image);

    try {
      await fetchOk(
        `${BASE_URL}/v2/professor/${faculty.ko.id}/${faculty.en.id}`,
        {
          method: 'PUT',
          body: formData,
        },
      );

      toast.success('역대 교수진을 수정했습니다.');
      navigate(`/people/emeritus-faculty/${faculty.ko.id}`);
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  };

  const onDelete = async () => {
    try {
      await fetchOk(
        `${BASE_URL}/v2/professor/${faculty.ko.id}/${faculty.en.id}`,
        {
          method: 'DELETE',
        },
      );

      toast.success('역대 교수진을 삭제했습니다.');
      navigate('/people/emeritus-faculty');
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  return (
    <PageLayout title="역대 교수진 편집" titleSize="xl" padding="default">
      <FacultyEditor
        defaultValues={defaultValues}
        labs={labs}
        onCancel={() => navigate(-1)}
        onSubmit={onSubmit}
        onDelete={onDelete}
      />
    </PageLayout>
  );
}
