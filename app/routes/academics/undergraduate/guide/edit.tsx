import type { Route } from '.react-router/types/app/routes/academics/undergraduate/guide/+types/edit';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import Fieldset from '~/components/common/form/Fieldset';
import Form from '~/components/common/form/Form';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import type { Guide } from '~/types/api/v2/academics/guide';
import type { EditorFile } from '~/types/form';
import { fetchJson, fetchOk } from '~/utils/fetch';
import { FormData2, getDeleteIds } from '~/utils/form';

interface GuideFormData {
  description: string;
  file: EditorFile[];
}

export async function loader() {
  return fetchJson<Guide>(`${BASE_URL}/v2/academics/undergraduate/guide`);
}

export default function UndergraduateGuideEditPage({
  loaderData,
}: Route.ComponentProps) {
  const defaultValues = {
    description: loaderData.description,
    file: loaderData.attachments.map((file) => ({
      type: 'UPLOADED_FILE' as const,
      file,
    })),
  };

  const methods = useForm<GuideFormData>({
    defaultValues,
    shouldFocusError: false,
  });

  const navigate = useNavigate();

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
      await fetchOk(`${BASE_URL}/v2/academics/undergraduate/guide`, {
        method: 'PUT',
        body: formData,
      });

      navigate('/academics/undergraduate/guide');
      toast.success('수정에 성공했습니다.');
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  };

  return (
    <PageLayout titleSize="xl" title="학부 안내 수정">
      <FormProvider {...methods}>
        <Form>
          <Fieldset.HTML>
            <Form.HTML name="description" />
          </Fieldset.HTML>
          <Fieldset.File>
            <Form.File name="file" />
          </Fieldset.File>
          <Form.Action
            onCancel={() => navigate('/academics/undergraduate/guide')}
            onSubmit={methods.handleSubmit(onSubmit)}
          />
        </Form>
      </FormProvider>
    </PageLayout>
  );
}
