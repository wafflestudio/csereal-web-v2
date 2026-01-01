import type { Route } from '.react-router/types/app/routes/academics/$studentType/course-changes/+types/create';
import { useNavigate } from 'react-router';
import { toast } from '~/components/ui/sonner';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import TimelineEditor, {
  type TimelineFormData,
} from '~/routes/academics/components/timeline/TimelineEditor';
import { fetchOk } from '~/utils/fetch';
import { FormData2 } from '~/utils/form';

export default function CourseChangesCreatePage({
  params,
}: Route.ComponentProps) {
  const { studentType } = params;
  const { t } = useLanguage({
    '학부 교과목 변경 내역 추가': 'Add Undergraduate Course Changes',
    '대학원 교과목 변경 내역 추가': 'Add Graduate Course Changes',
    '저장에 성공했습니다.': 'Successfully saved.',
    '저장에 실패했습니다.': 'Failed to save.',
  });
  const navigate = useNavigate();

  const title =
    studentType === 'graduate'
      ? t('대학원 교과목 변경 내역 추가')
      : t('학부 교과목 변경 내역 추가');

  const onSubmit = async (data: TimelineFormData) => {
    const formData = new FormData2();
    formData.appendJson('request', {
      name: '',
      year: data.year,
      description: data.description,
    });
    formData.appendIfLocal('attachments', data.file);

    try {
      await fetchOk(`${BASE_URL}/v2/academics/${studentType}/course-changes`, {
        method: 'POST',
        body: formData,
      });
      toast.success(t('저장에 성공했습니다.'));
      navigate(`/academics/${studentType}/course-changes`);
    } catch {
      toast.error(t('저장에 실패했습니다.'));
    }
  };

  return (
    <PageLayout title={title} titleSize="xl">
      <TimelineEditor
        cancelPath={`/academics/${studentType}/course-changes`}
        onSubmit={onSubmit}
      />
    </PageLayout>
  );
}
