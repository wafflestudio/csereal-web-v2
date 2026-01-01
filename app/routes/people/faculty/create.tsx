import type { Route } from '.react-router/types/app/routes/people/faculty/+types/create';
import type { LoaderFunctionArgs } from 'react-router';
import { useNavigate } from 'react-router';
import { toast } from '~/components/ui/sonner';

import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import FacultyEditor, {
  type FacultyFormData,
} from '~/routes/people/components/FacultyEditor';
import type { Faculty, FacultyStatus } from '~/types/api/v2/professor';
import type { SimpleResearchLab } from '~/types/api/v2/research/labs';
import { fetchJson } from '~/utils/fetch';
import { FormData2 } from '~/utils/form';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const status = (url.searchParams.get('status') as FacultyStatus) ?? 'ACTIVE';

  const [labsKo, labsEn] = await Promise.all([
    fetchJson<SimpleResearchLab[]>(`${BASE_URL}/v2/research/lab?language=ko`),
    fetchJson<SimpleResearchLab[]>(`${BASE_URL}/v2/research/lab?language=en`),
  ]);

  return { status, labs: { ko: labsKo, en: labsEn } };
}

export default function FacultyCreate({ loaderData }: Route.ComponentProps) {
  const { status, labs } = loaderData;
  const navigate = useNavigate();
  const { locale } = useLanguage({});

  const onSubmit = async (content: FacultyFormData) => {
    const formData = new FormData2();

    formData.appendJson('request', {
      ko: {
        ...content.ko,
        status: content.status,
        image: undefined,
        startDate: content.ko.startDate.toISOString(),
        endDate: content.ko.endDate.toISOString(),
      },
      en: {
        ...content.en,
        status: content.status,
        image: undefined,
        startDate: content.en.startDate.toISOString(),
        endDate: content.en.endDate.toISOString(),
      },
    });
    formData.appendIfLocal('mainImage', content.ko.image);

    try {
      const response = await fetchJson<{ ko: Faculty; en: Faculty }>(
        `${BASE_URL}/v2/professor`,
        { method: 'POST', body: formData },
      );
      toast.success('교수진을 추가했습니다.');

      const path =
        content.status === 'INACTIVE'
          ? '/people/emeritus-faculty'
          : '/people/faculty';
      navigate(`/${locale}${path}/${response.ko.id}`);
    } catch {
      toast.error('추가에 실패했습니다.');
    }
  };

  return (
    <PageLayout title="교수진 추가" titleSize="xl" padding="default">
      <FacultyEditor
        status={status}
        labs={labs}
        onCancel={() => navigate(`/${locale}/people/faculty`)}
        onSubmit={onSubmit}
      />
    </PageLayout>
  );
}
