import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import Fieldset from '~/components/common/form/Fieldset';
import Form from '~/components/common/form/Form';
import LanguagePicker, {
  type Language,
} from '~/components/common/form/LanguagePicker';
import { useLanguage } from '~/hooks/useLanguage';
import type { SimpleFaculty } from '~/types/api/v2/professor';
import type { ResearchGroup } from '~/types/api/v2/research/groups';
import type { EditorFile } from '~/types/form';

type LanguageSpecificLabData = {
  name: string;
  description: string;
  groupId: number | null;
  professorId: number | null;
  location: string;
};

export type ResearchLabFormData = {
  ko: LanguageSpecificLabData;
  en: LanguageSpecificLabData;
  acronym: string;
  tel: string;
  websiteURL: string;
  youtube: string;
  pdf: EditorFile[];
};

interface ResearchLabEditorProps {
  professors: { ko: SimpleFaculty[]; en: SimpleFaculty[] };
  groups: { ko: ResearchGroup[]; en: ResearchGroup[] };
  defaultValues?: ResearchLabFormData;
  onSubmit: (formData: ResearchLabFormData) => void;
  onDelete?: () => Promise<void>;
}

const defaultLabValue: LanguageSpecificLabData = {
  name: '',
  description: '',
  groupId: null,
  professorId: null,
  location: '',
};

export default function ResearchLabEditor({
  onSubmit,
  professors,
  groups,
  defaultValues,
  onDelete,
}: ResearchLabEditorProps) {
  const formMethods = useForm<ResearchLabFormData>({
    defaultValues: defaultValues ?? {
      ko: defaultLabValue,
      en: defaultLabValue,
      tel: '',
      acronym: '',
      youtube: '',
      websiteURL: '',
      pdf: [],
    },
    shouldFocusError: false,
  });

  const { handleSubmit } = formMethods;
  const [language, setLanguage] = useState<Language>('ko');
  const navigate = useNavigate();
  const { locale } = useLanguage({});

  const onCancel = () => navigate(`/${locale}/research/labs`);

  return (
    <FormProvider {...formMethods}>
      <Form>
        <LanguagePicker onChange={setLanguage} selected={language} />
        {language === 'ko' && (
          <Editor language="ko" professors={professors} groups={groups} />
        )}
        {language === 'en' && (
          <Editor language="en" professors={professors} groups={groups} />
        )}
        <Form.Action
          onCancel={onCancel}
          onSubmit={handleSubmit(onSubmit)}
          onDelete={onDelete}
        />
      </Form>
    </FormProvider>
  );
}

const Editor = ({
  language,
  professors,
  groups,
}: {
  language: Language;
  professors: { ko: SimpleFaculty[]; en: SimpleFaculty[] };
  groups: { ko: ResearchGroup[]; en: ResearchGroup[] };
}) => {
  return (
    <>
      <Fieldset title="연구실명" spacing="6" required>
        <Form.Text
          name={`${language}.name`}
          maxWidth="max-w-[30rem]"
          options={{
            required: { value: true, message: '연구실명을 입력해주세요.' },
          }}
        />
      </Fieldset>
      <div className="mb-11 flex w-120 gap-6">
        <Fieldset title="지도교수" spacing="2.5">
          <Form.Dropdown
            name={`${language}.professorId`}
            contents={[
              { label: '선택 안 함', value: null },
              ...professors[language].map((prof) => ({
                label: prof.name,
                value: prof.id,
              })),
            ]}
          />
        </Fieldset>
        <Fieldset title="연구실 약자" spacing="2.5">
          <Form.Text name="acronym" maxWidth="w-[17rem]" />
        </Fieldset>
      </div>
      <div className="mb-6 flex w-180 gap-6">
        <Fieldset title="전화" spacing="2.5">
          <Form.Text
            name="tel"
            maxWidth="w-[21.75rem]"
            placeholder="예: (02) 880-7302"
          />
        </Fieldset>
        <Fieldset title="웹사이트 주소" spacing="2.5">
          <Form.Text
            name="websiteURL"
            maxWidth="w-[21.75rem]"
            placeholder="예: https://www.example.com"
          />
        </Fieldset>
      </div>

      <Fieldset title="연구실 위치" spacing="11">
        <Form.Text
          name={`${language}.location`}
          maxWidth="w-[45rem]"
          placeholder='복수일 경우 " / "로 구분해주세요. 예: 301동 515호 / 518호 / 551-1호'
        />
      </Fieldset>

      <Fieldset title="연구·교육 스트림" spacing="11" required>
        <Form.Dropdown
          name={`${language}.groupId`}
          contents={[
            { label: '선택 안 함', value: null },
            ...groups[language].map((group) => ({
              label: `${group.name} 스트림`,
              value: group.id,
            })),
          ]}
          rules={{
            required: {
              value: true,
              message: '연구·교육 스트림을 선택해주세요.',
            },
          }}
        />
      </Fieldset>

      <Fieldset title="소개 자료" spacing="8">
        <div className="mb-2.5 flex w-180 items-center">
          <span className="w-14 text-sm text-neutral-400">| 문서</span>
          <Form.File name="pdf" multiple={false} />
        </div>
        <div className="flex w-180 items-center">
          <span className="w-14 text-sm text-neutral-400">| 유튜브</span>
          <Form.Text
            name="youtube"
            maxWidth="w-[41.5rem]"
            placeholder="예: https://www.youtube.com/watch?v=bCLWYhurBuo"
          />
        </div>
      </Fieldset>

      <Fieldset title="연구실 설명 및 이미지" spacing="10" required>
        <Form.HTML
          name={`${language}.description`}
          options={{
            required: { value: true, message: '연구실 설명을 입력해주세요.' },
          }}
        />
      </Fieldset>
    </>
  );
};
