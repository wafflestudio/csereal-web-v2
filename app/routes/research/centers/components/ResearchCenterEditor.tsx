'use client';

import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Fieldset from '~/components/common/form/Fieldset';
import Form from '~/components/common/form/Form';
import LanguagePicker, {
  type Language,
} from '~/components/common/form/LanguagePicker';
import type { EditorImage } from '~/types/form';

interface ResearchCenterFormFields {
  name: string;
  websiteURL: string;
  description: string;
  type: 'centers';
}

export interface ResearchCenterFormData {
  ko: ResearchCenterFormFields;
  en: ResearchCenterFormFields;
  image: EditorImage | null;
}

interface ResearchCenterEditorProps {
  defaultValues?: ResearchCenterFormData;
  onCancel: () => void;
  onSubmit: (formData: ResearchCenterFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export default function ResearchCenterEditor({
  defaultValues,
  onCancel,
  onSubmit,
  onDelete,
}: ResearchCenterEditorProps) {
  const [language, setLanguage] = useState<Language>('ko');
  const formMethods = useForm<ResearchCenterFormData>({
    defaultValues: defaultValues ?? {
      ko: { name: '', websiteURL: '', description: '', type: 'centers' },
      en: { name: '', websiteURL: '', description: '', type: 'centers' },
      image: null,
    },
    shouldFocusError: false,
  });
  const { handleSubmit } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <Form>
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
      <Fieldset title="센터 이름" spacing="8" required>
        <Form.Text
          name={`${language}.name`}
          options={{
            required: { value: true, message: '이름을 입력해주세요.' },
          }}
        />
      </Fieldset>

      <Fieldset title="웹사이트 주소" spacing="8" titleSpacing="2">
        <Form.Text name={`${language}.websiteURL`} />
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
          연구 센터 대표 이미지입니다.
        </label>
        <Form.Image name="image" />
      </Fieldset.Image>
    </>
  );
};
