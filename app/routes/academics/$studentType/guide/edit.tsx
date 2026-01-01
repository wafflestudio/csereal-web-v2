import type { Route } from '.react-router/types/app/routes/academics/$studentType/guide/+types/edit';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from '~/components/ui/sonner';
import Fieldset from '~/components/form/Fieldset';
import Form from '~/components/form/Form';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import type { Guide } from '~/types/api/v2/academics/guide';
import type { EditorFile } from '~/types/form';
import { fetchJson, fetchOk } from '~/utils/fetch';
import { FormData2, getDeleteIds } from '~/utils/form';

interface GuideFormData {
  description: string;
  file: EditorFile[];
}

export async function loader({ params }: Route.LoaderArgs) {
  const { studentType } = params;
  return fetchJson<Guide>(`${BASE_URL}/v2/academics/${studentType}/guide`);
}

export default function GuideEditPage({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { studentType } = params;
  const { t } = useLanguage({
    '수정에 성공했습니다.': 'Successfully updated.',
    '수정에 실패했습니다.': 'Failed to update.',
    '대학원 안내 수정': 'Edit Graduate Guide',
    '학부 안내 수정': 'Edit Undergraduate Guide',
  });

  const defaultValues = {
    description: loaderData.description,
    file: loaderData.attachments.map((file: any) => ({
      type: 'UPLOADED_FILE' as const,
      file,
    })),
  };

  const methods = useForm<GuideFormData>({
    defaultValues,
    shouldFocusError: false,
  });

  const navigate = useNavigate();

  const isGraduate = studentType === 'graduate';
  const title = isGraduate ? t('대학원 안내 수정') : t('학부 안내 수정');

  const onSubmit = async (data: GuideFormData) => {
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
      await fetchOk(`${BASE_URL}/v2/academics/${studentType}/guide`, {
        method: 'PUT',
        body: formData,
      });

      navigate(`/academics/${studentType}/guide`);
      toast.success(t('수정에 성공했습니다.'));
    } catch {
      toast.error(t('수정에 실패했습니다.'));
    }
  };

  return (
    <PageLayout titleSize="xl" title={title}>
      <FormProvider {...methods}>
        <Form>
          <Fieldset.HTML>
            <Form.HTML name="description" />
          </Fieldset.HTML>
          <Fieldset.File>
            <Form.File name="file" />
          </Fieldset.File>
          <Form.Action
            onCancel={() => navigate(`/academics/${studentType}/guide`)}
            onSubmit={methods.handleSubmit(onSubmit)}
          />
        </Form>
      </FormProvider>
    </PageLayout>
  );
}
