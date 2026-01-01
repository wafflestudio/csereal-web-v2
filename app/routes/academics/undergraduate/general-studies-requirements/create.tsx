import { useNavigate } from 'react-router';
import { toast } from '~/components/ui/sonner';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import TimelineEditor, {
  type TimelineFormData,
} from '~/routes/academics/components/timeline/TimelineEditor';
import { fetchOk } from '~/utils/fetch';
import { FormData2 } from '~/utils/form';

export default function GeneralStudiesCreatePage() {
  const { t } = useLanguage({ '필수 교양 과목 추가': 'Add General Studies' });
  const subNav = useAcademicsSubNav();
  const navigate = useNavigate();

  const title = t('필수 교양 과목 추가');
  const onSubmit = async (data: TimelineFormData) => {
    const formData = new FormData2();
    formData.appendJson('request', {
      year: data.year,
      description: data.description,
      name: '', // TODO: 백엔드에서 name 필드 제거 필요
    });
    formData.appendIfLocal('attachments', data.file);

    try {
      await fetchOk(
        `${BASE_URL}/v2/academics/undergraduate/general-studies-requirements`,
        {
          method: 'POST',
          body: formData,
        },
      );
      toast.success('추가에 성공했습니다.');
      navigate('/academics/undergraduate/general-studies-requirements');
    } catch {
      toast.error('추가에 실패했습니다.');
    }
  };

  return (
    <PageLayout title={title} titleSize="xl" subNav={subNav}>
      <TimelineEditor
        onSubmit={onSubmit}
        cancelPath="/academics/undergraduate/general-studies-requirements"
      />
    </PageLayout>
  );
}
