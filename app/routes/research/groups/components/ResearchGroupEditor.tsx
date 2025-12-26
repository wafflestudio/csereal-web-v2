import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Fieldset from '~/components/common/form/Fieldset';
import Form from '~/components/common/form/Form';
import LanguagePicker, {
  type Language,
} from '~/components/common/form/LanguagePicker';
import type { EditorImage } from '~/types/form';

interface ResearchGroupFormFields {
  name: string;
  description: string;
  type: 'groups';
}

export interface ResearchGroupFormData {
  ko: ResearchGroupFormFields;
  en: ResearchGroupFormFields;
  image: EditorImage | null;
}

interface ResearchGroupEditorProps {
  defaultValues?: ResearchGroupFormData;
  onCancel: () => void;
  onSubmit: (formData: ResearchGroupFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export default function ResearchGroupEditor({
  defaultValues,
  onCancel,
  onSubmit,
  onDelete,
}: ResearchGroupEditorProps) {
  const [language, setLanguage] = useState<Language>('ko');
  const formMethods = useForm<ResearchGroupFormData>({
    defaultValues: defaultValues ?? {
      ko: { name: '', description: '', type: 'groups' },
      en: { name: '', description: '', type: 'groups' },
      image: null,
    },
    shouldFocusError: false,
  });
  const { handleSubmit } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <Form>
        <div className="mb-8 text-main-orange">
          * 각 연구실의 스트림은{' '}
          <b>연구실 목록 {'>'} 개별 연구실의 편집 페이지</b>
          에서 수정할 수 있습니다.
        </div>

        <LanguagePicker selected={language} onChange={setLanguage} />
        {language === 'ko' && <Editor language="ko" />}
        {language === 'en' && <Editor language="en" />}

        <Form.Action
          onCancel={onCancel}
          onSubmit={handleSubmit(onSubmit)}
          onDelete={onDelete}
        />
      </Form>
    </FormProvider>
  );
}

const Editor = ({ language }: { language: Language }) => {
  return (
    <>
      <Fieldset title="스트림 이름" spacing="8" required>
        <Form.Text
          name={`${language}.name`}
          options={{
            required: { value: true, message: '이름을 입력해주세요.' },
          }}
        />
      </Fieldset>

      <Fieldset.HTML>
        <Form.HTML
          name={`${language}.description`}
          options={{
            required: { value: true, message: '내용을 입력해주세요.' },
          }}
        />
      </Fieldset.HTML>

      <Fieldset.Image>
        <label
          htmlFor="image"
          className="mb-3 whitespace-pre-wrap text-sm font-normal tracking-wide text-neutral-500"
        >
          글 우측 상단에 들어가는 이미지입니다.
        </label>
        <Form.Image name="image" />
      </Fieldset.Image>
    </>
  );
};
