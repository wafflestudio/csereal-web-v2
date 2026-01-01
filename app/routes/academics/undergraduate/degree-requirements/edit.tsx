import type { Route } from '.react-router/types/app/routes/academics/undergraduate/degree-requirements/+types/edit';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from '~/components/ui/sonner';
import Fieldset from '~/components/form/Fieldset';
import Form from '~/components/form/Form';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import type { DegreeRequirements } from '~/types/api/v2/academics/undergraduate/degree-requirements';
import type { EditorFile } from '~/types/form';
import { isUploadedFile } from '~/types/form';
import { fetchJson, fetchOk } from '~/utils/fetch';
import { contentToFormData, getAttachmentDeleteIds } from '~/utils/formData';

interface DegreeRequirementsFormData {
  description: string;
  files: EditorFile[];
}

export async function loader() {
  const data = await fetchJson<DegreeRequirements>(
    `${BASE_URL}/v2/academics/undergraduate/degree-requirements`,
  );

  return {
    description: data.description,
    files: data.attachments.map((file) => ({
      type: 'UPLOADED_FILE' as const,
      file,
    })),
  };
}

export default function DegreeRequirementsEditPage({
  loaderData,
}: Route.ComponentProps) {
  const { t } = useLanguage({
    '학부 졸업규정을 수정했습니다.':
      'Degree requirements updated successfully.',
    '학부 졸업규정을 수정하지 못했습니다.':
      'Failed to update degree requirements.',
  });

  const formMethods = useForm<DegreeRequirementsFormData>({
    defaultValues: loaderData,
    shouldFocusError: false,
  });
  const { handleSubmit } = formMethods;

  const navigate = useNavigate();
  const subNav = useAcademicsSubNav();
  const title = t('졸업 규정');
  const onCancel = () =>
    navigate('/academics/undergraduate/degree-requirements');

  const onSubmit = async (content: DegreeRequirementsFormData) => {
    const formData = contentToFormData('EDIT', {
      requestObject: {
        description: content.description,
        deleteIds: getAttachmentDeleteIds(
          content.files,
          loaderData.files
            .filter(isUploadedFile)
            .map(
              (x: { type: 'UPLOADED_FILE'; file: { id: number } }) => x.file.id,
            ),
        ),
      },
      attachments: content.files,
    });

    try {
      await fetchOk(
        `${BASE_URL}/v2/academics/undergraduate/degree-requirements`,
        { method: 'PUT', body: formData },
      );
      toast.success(t('학부 졸업규정을 수정했습니다.'));
      navigate('/academics/undergraduate/degree-requirements');
    } catch {
      toast.error(t('학부 졸업규정을 수정하지 못했습니다.'));
    }
  };

  return (
    <PageLayout title={title} titleSize="xl" subNav={subNav}>
      <FormProvider {...formMethods}>
        <Form>
          <Fieldset.HTML>
            <Form.HTML name="description" />
          </Fieldset.HTML>
          <Fieldset.File>
            <Form.File name="files" />
          </Fieldset.File>
          <Form.Action onCancel={onCancel} onSubmit={handleSubmit(onSubmit)} />
        </Form>
      </FormProvider>
    </PageLayout>
  );
}
