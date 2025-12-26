import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Fieldset from '~/components/common/form/Fieldset';
import Form from '~/components/common/form/Form';
import LanguagePicker, {
  type Language,
} from '~/components/common/form/LanguagePicker';
import type { Staff } from '~/types/api/v2/staff';
import type { EditorImage } from '~/types/form';

interface StaffFormFields {
  name: string;
  role: string;
  office: string;
  phone: string;
  email: string;
  tasks: string[];
  image: EditorImage | null;
}

export interface StaffFormData {
  ko: StaffFormFields;
  en: StaffFormFields;
}

interface StaffEditorProps {
  defaultValues?: {
    ko?: Partial<Staff>;
    en?: Partial<Staff>;
  };
  onCancel: () => void;
  onSubmit: (formData: StaffFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

const normalizeStaffData = (staff?: Partial<Staff>): StaffFormFields => {
  return {
    name: staff?.name ?? '',
    role: staff?.role ?? '',
    office: staff?.office ?? '',
    phone: staff?.phone ?? '',
    email: staff?.email ?? '',
    tasks: staff?.tasks ?? [],
    image: staff?.imageURL
      ? { type: 'UPLOADED_IMAGE', url: staff.imageURL }
      : null,
  };
};

export default function StaffEditor({
  defaultValues,
  onCancel,
  onSubmit,
  onDelete,
}: StaffEditorProps) {
  const formMethods = useForm<StaffFormData>({
    defaultValues: {
      ko: normalizeStaffData(defaultValues?.ko),
      en: normalizeStaffData(defaultValues?.en),
    },
    shouldFocusError: false,
  });
  const { handleSubmit } = formMethods;
  const [language, setLanguage] = useState<Language>('ko');

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
      <Fieldset title="이름" spacing="5" titleSpacing="2" required>
        <Form.Text
          name={`${language}.name`}
          maxWidth="max-w-[30rem]"
          options={{
            required: { value: true, message: '이름을 입력해주세요.' },
          }}
        />
      </Fieldset>
      <Fieldset title="업무 요약" spacing="10" titleSpacing="2" required>
        <Form.Text
          name={`${language}.role`}
          maxWidth="max-w-[30rem]"
          placeholder="예: 교원인사, 일반서무 등"
          options={{
            required: { value: true, message: '업무 요약을 입력해주세요.' },
          }}
        />
      </Fieldset>
      <Fieldset title="사진" spacing="12" titleSpacing="2">
        <label
          htmlFor={`${language}.image`}
          className="mb-3 whitespace-pre-wrap text-sm font-normal tracking-wide text-neutral-500"
        >
          3:4 비율의 증명사진이 가장 적합합니다.
        </label>
        <Form.Image name={`${language}.image`} />
      </Fieldset>

      <Form.Section title="연락처 정보" titleSpacing="3" spacing="12">
        <Fieldset title="위치" spacing="5" titleSpacing="2" required>
          <Form.Text
            name={`${language}.office`}
            maxWidth="max-w-[20rem]"
            placeholder="예: 301동 316호"
            options={{
              required: { value: true, message: '위치를 입력해주세요.' },
            }}
          />
        </Fieldset>
        <Fieldset title="전화번호" spacing="5" titleSpacing="2" required>
          <Form.Text
            name={`${language}.phone`}
            maxWidth="max-w-[20rem]"
            placeholder="예: (02) 880-7302"
            options={{
              required: { value: true, message: '전화번호를 입력해주세요.' },
            }}
          />
        </Fieldset>
        <Fieldset title="이메일" titleSpacing="2" required>
          <Form.Text
            name={`${language}.email`}
            maxWidth="max-w-[25rem]"
            options={{
              required: { value: true, message: '이메일을 입력해주세요.' },
            }}
          />
        </Fieldset>
      </Form.Section>

      <Fieldset title="주요 업무" spacing="2.5" titleSpacing="2" required>
        <Form.TextList
          name={`${language}.tasks`}
          placeholder="예: 학부생 수료, 졸업사정 및 논문 관리"
        />
      </Fieldset>
    </>
  );
};
