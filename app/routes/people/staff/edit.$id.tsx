import type { Route } from '.react-router/types/app/routes/people/staff/+types/edit.$id';
import { useNavigate } from 'react-router';
import { toast } from '~/components/ui/sonner';

import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import StaffEditor, {
  type StaffFormData,
} from '~/routes/people/components/StaffEditor';
import type { Staff } from '~/types/api/v2/staff';
import { fetchJson, fetchOk } from '~/utils/fetch';
import { FormData2 } from '~/utils/form';

export async function loader({ params }: Route.LoaderArgs) {
  const id = parseInt(params.id, 10);

  const staff = await fetchJson<{ ko: Staff; en: Staff }>(
    `${BASE_URL}/v2/staff/${id}`,
  );

  return { staff };
}

export default function StaffEdit({ loaderData }: Route.ComponentProps) {
  const { staff } = loaderData;
  const navigate = useNavigate();

  const defaultValues = {
    ko: staff.ko,
    en: staff.en,
  };

  const onSubmit = async (content: StaffFormData) => {
    const formData = new FormData2();
    const removeImage =
      defaultValues.ko?.imageURL !== null && content.ko.image === null;

    formData.appendJson('request', {
      ko: { ...content.ko, image: undefined, removeImage },
      en: { ...content.en, image: undefined, removeImage },
    });
    formData.appendIfLocal('newMainImage', content.ko.image);

    try {
      await fetchOk(`${BASE_URL}/v2/staff/${staff.ko.id}/${staff.en.id}`, {
        method: 'PUT',
        body: formData,
      });

      toast.success('행정직원을 수정했습니다.');
      navigate(`/people/staff/${staff.ko.id}`);
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  };

  const onDelete = async () => {
    try {
      await fetchOk(`${BASE_URL}/v2/staff/${staff.ko.id}/${staff.en.id}`, {
        method: 'DELETE',
      });

      toast.success('행정직원을 삭제했습니다.');
      navigate('/people/staff');
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  return (
    <PageLayout title="행정직원 편집" titleSize="xl" padding="default">
      <StaffEditor
        defaultValues={defaultValues}
        onCancel={() => navigate(-1)}
        onSubmit={onSubmit}
        onDelete={onDelete}
      />
    </PageLayout>
  );
}
