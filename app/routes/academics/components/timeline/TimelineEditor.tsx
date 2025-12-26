import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Fieldset from '~/components/common/form/Fieldset';
import Form from '~/components/common/form/Form';
import type { EditorFile } from '~/types/form';

export type TimelineFormData = {
  year: number;
  description: string;
  file: EditorFile[];
};

interface Props {
  defaultValues?: TimelineFormData;
  onSubmit: (data: TimelineFormData) => Promise<void>;
  cancelPath: string;
}

export default function TimelineEditor({
  defaultValues,
  onSubmit,
  cancelPath,
}: Props) {
  const formMethods = useForm<TimelineFormData>({
    defaultValues: defaultValues ?? {
      year: new Date().getFullYear() + 1,
      description: '',
      file: [],
    },
    shouldFocusError: false,
  });
  const { handleSubmit } = formMethods;

  const navigate = useNavigate();
  const onCancel = () => navigate(cancelPath);

  return (
    <FormProvider {...formMethods}>
      <Form>
        <Fieldset title="연도" spacing="6" titleSpacing="2" required>
          <Form.Text
            name="year"
            maxWidth="w-[55px]"
            disabled={defaultValues !== undefined}
            options={{
              required: { value: true, message: '연도를 입력해주세요.' },
              valueAsNumber: true,
            }}
          />
        </Fieldset>
        <Fieldset.HTML>
          <Form.HTML
            name="description"
            options={{
              required: { value: true, message: '내용을 입력해주세요.' },
            }}
          />
        </Fieldset.HTML>
        <Fieldset.File>
          <Form.File name="file" />
        </Fieldset.File>
        <Form.Action onCancel={onCancel} onSubmit={handleSubmit(onSubmit)} />
      </Form>
    </FormProvider>
  );
}
