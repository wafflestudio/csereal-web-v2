import type { Route } from '.react-router/types/app/routes/academics/undergraduate/curriculum/+types/edit.$year';
import type { LoaderFunctionArgs } from 'react-router';
import { useNavigate } from 'react-router';
import { toast } from '~/components/ui/sonner';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import TimelineEditor, {
  type TimelineFormData,
} from '~/routes/academics/components/timeline/TimelineEditor';
import type { TimelineContent } from '~/types/api/v2/academics';
import { fetchJson, fetchOk } from '~/utils/fetch';
import { FormData2, getDeleteIds } from '~/utils/form';

export async function loader({ params }: LoaderFunctionArgs) {
  const { year } = params;

  if (!year) {
    throw new Error('Year parameter is required');
  }

  const data = await fetchJson<TimelineContent[]>(
    `${BASE_URL}/v2/academics/undergraduate/curriculum`,
  );
  const yearNum = Number(year);
  const selected = data.find((item) => item.year === yearNum);

  if (!selected) {
    throw new Response('해당 연도 내용이 존재하지 않습니다.', { status: 404 });
  }

  return selected;
}

export default function CurriculumEditPage({
  loaderData: initContent,
}: Route.ComponentProps) {
  const { t } = useLanguage({
    '전공 이수 표준 형태 편집': 'Edit Curriculum',
  });
  const subNav = useAcademicsSubNav();
  const navigate = useNavigate();

  const title = t('전공 이수 표준 형태 편집');
  const defaultValues: TimelineFormData = {
    year: initContent.year,
    description: initContent.description,
    file: initContent.attachments.map((file) => ({
      type: 'UPLOADED_FILE' as const,
      file,
    })),
  };

  const onSubmit = async (data: TimelineFormData) => {
    const deleteIds = getDeleteIds({
      prev: defaultValues.file,
      cur: data.file,
    });

    const formData = new FormData2();
    formData.appendJson('request', {
      description: data.description,
      deleteIds,
    });
    formData.appendIfLocal('newAttachments', data.file);

    try {
      await fetchOk(
        `${BASE_URL}/v2/academics/undergraduate/curriculum/${initContent.year}`,
        {
          method: 'PUT',
          body: formData,
        },
      );

      toast.success('수정에 성공했습니다.');
      navigate('/academics/undergraduate/curriculum');
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  };

  return (
    <PageLayout title={title} titleSize="xl" subNav={subNav}>
      <TimelineEditor
        onSubmit={onSubmit}
        cancelPath="/academics/undergraduate/curriculum"
        defaultValues={defaultValues}
      />
    </PageLayout>
  );
}
