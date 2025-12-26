import type { Route } from '.react-router/types/app/routes/research/labs/$id/+types/edit';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import ResearchLabEditor, {
  type ResearchLabFormData,
} from '~/routes/research/labs/components/ResearchLabEditor';
import type { SimpleFaculty } from '~/types/api/v2/professor';
import type { ResearchGroup } from '~/types/api/v2/research/groups';
import type { ResearchLabWithLanguage } from '~/types/api/v2/research/labs';
import { fetchJson } from '~/utils/fetch';
import { FormData2 } from '~/utils/form';

export async function loader({ params }: Route.LoaderArgs) {
  const id = parseInt(params.id, 10);

  if (!id || Number.isNaN(id)) {
    throw new Response('Invalid ID', { status: 400 });
  }

  const [lab, groupsKo, groupsEn, professorsKo, professorsEn] =
    await Promise.all([
      fetchJson<ResearchLabWithLanguage>(`${BASE_URL}/v2/research/lab/${id}`),
      fetchJson<ResearchGroup[]>(`${BASE_URL}/v2/research/groups?language=ko`),
      fetchJson<ResearchGroup[]>(`${BASE_URL}/v2/research/groups?language=en`),
      fetchJson<{ description: string; professors: SimpleFaculty[] }>(
        `${BASE_URL}/v2/professor/active?language=ko`,
      ),
      fetchJson<{ description: string; professors: SimpleFaculty[] }>(
        `${BASE_URL}/v2/professor/active?language=en`,
      ),
    ]);

  if (!lab || !lab.ko || !lab.en) {
    throw new Response('Lab not found', { status: 404 });
  }

  return {
    lab,
    groups: { ko: groupsKo, en: groupsEn },
    professors: { ko: professorsKo.professors, en: professorsEn.professors },
  };
}

export default function ResearchLabEdit({ loaderData }: Route.ComponentProps) {
  const { lab, groups, professors } = loaderData;
  const navigate = useNavigate();
  const { locale } = useLanguage({});

  const defaultValues: ResearchLabFormData = {
    ko: {
      name: lab.ko.name,
      description: lab.ko.description,
      groupId: lab.ko.group?.id ?? null,
      professorId: lab.ko.professors[0]?.id ?? null,
      location: lab.ko.location || '',
    },
    en: {
      name: lab.en.name,
      description: lab.en.description,
      groupId: lab.en.group?.id ?? null,
      professorId: lab.en.professors[0]?.id ?? null,
      location: lab.en.location || '',
    },
    acronym: lab.ko.acronym,
    tel: lab.ko.tel || '',
    websiteURL: lab.ko.websiteURL || '',
    youtube: lab.ko.youtube || '',
    pdf: lab.ko.pdf ? [{ type: 'UPLOADED_FILE', file: lab.ko.pdf }] : [],
  };

  const onSubmit = async ({ ko, en, ...common }: ResearchLabFormData) => {
    const removePdf = lab.ko.pdf !== null && common.pdf.length === 0;

    const formData = new FormData2();

    formData.appendJson('request', {
      ko: {
        ...ko,
        ...common,
        professorIds: ko.professorId ? [ko.professorId] : [],
        removePdf,
      },
      en: {
        ...en,
        ...common,
        professorIds: en.professorId ? [en.professorId] : [],
        removePdf,
      },
    });

    formData.appendIfLocal('pdf', common.pdf);

    try {
      await fetchJson(`${BASE_URL}/v2/research/lab/${lab.ko.id}/${lab.en.id}`, {
        method: 'PUT',
        body: formData,
      });

      toast.success('연구실을 수정했습니다.');
      navigate(`/${locale}/research/labs/${lab.ko.id}`);
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  };

  const onDelete = async () => {
    try {
      await fetchJson(`${BASE_URL}/v2/research/lab/${lab.ko.id}/${lab.en.id}`, {
        method: 'DELETE',
      });

      toast.success('연구실을 삭제했습니다.');
      navigate(`/${locale}/research/labs`);
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  return (
    <PageLayout title="연구실 편집" titleSize="xl" padding="default">
      <ResearchLabEditor
        groups={groups}
        professors={professors}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        onDelete={onDelete}
      />
    </PageLayout>
  );
}
