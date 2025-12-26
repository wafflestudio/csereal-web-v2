import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import StaffEditor, {
  type StaffFormData,
} from '~/routes/people/components/StaffEditor';
import type { Staff } from '~/types/api/v2/staff';
import { fetchJson } from '~/utils/fetch';
import { FormData2 } from '~/utils/form';

export default function StaffCreate() {
  const navigate = useNavigate();
  const { locale } = useLanguage({});

  const onSubmit = async (content: StaffFormData) => {
    const formData = new FormData2();

    formData.appendJson('request', {
      ko: { ...content.ko, image: undefined },
      en: { ...content.en, image: undefined },
    });
    formData.appendIfLocal('mainImage', content.ko.image);

    try {
      const response = await fetchJson<{ ko: Staff; en: Staff }>(
        `${BASE_URL}/v2/staff`,
        {
          method: 'POST',
          body: formData,
        },
      );

      toast.success('행정직원을 추가했습니다.');
      navigate(`/${locale}/people/staff/${response[locale].id}`);
    } catch {
      toast.error('추가에 실패했습니다.');
    }
  };

  return (
    <PageLayout title="행정직원 추가" titleSize="xl" padding="default">
      <StaffEditor
        onCancel={() => navigate(`/${locale}/people/staff`)}
        onSubmit={onSubmit}
      />
    </PageLayout>
  );
}
