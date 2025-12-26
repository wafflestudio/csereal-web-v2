import { useState } from 'react';
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';

import Fieldset from '~/components/common/form/Fieldset';
import Form from '~/components/common/form/Form';
import LanguagePicker, {
  type Language,
} from '~/components/common/form/LanguagePicker';
import {
  FACULTY_STATUS,
  type Faculty,
  type FacultyStatus,
} from '~/types/api/v2/professor';
import type { SimpleResearchLab } from '~/types/api/v2/research/labs';
import type { EditorImage } from '~/types/form';

interface FacultyFormFields {
  name: string;
  academicRank: string;
  department: string;
  image: EditorImage | null;
  phone: string;
  email: string;
  office: string;
  fax: string;
  website: string;
  educations: string[];
  researchAreas: string[];
  careers: string[];
  labId: number | null;
  startDate: Date;
  endDate: Date;
}

export interface FacultyFormData {
  status: FacultyStatus;
  ko: FacultyFormFields;
  en: FacultyFormFields;
}

interface FacultyEditorProps {
  defaultValues?: {
    status?: FacultyStatus;
    ko?: Partial<Faculty>;
    en?: Partial<Faculty>;
  };
  status?: FacultyStatus;
  labs: { ko: SimpleResearchLab[]; en: SimpleResearchLab[] };
  onCancel: () => void;
  onSubmit: (formData: FacultyFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

const normalizeFacultyData = (
  faculty?: Partial<Faculty>,
): FacultyFormFields => {
  return {
    name: faculty?.name ?? '',
    academicRank: faculty?.academicRank ?? '',
    department: faculty?.department ?? '',
    image: faculty?.imageURL
      ? { type: 'UPLOADED_IMAGE', url: faculty.imageURL }
      : null,
    email: faculty?.email ?? '',
    phone: faculty?.phone ?? '',
    office: faculty?.office ?? '',
    fax: faculty?.fax ?? '',
    website: faculty?.website ?? '',
    educations: faculty?.educations ?? [],
    researchAreas: faculty?.researchAreas ?? [],
    careers: faculty?.careers ?? [],
    labId: faculty?.labId ?? null,
    startDate: faculty?.startDate ? new Date(faculty.startDate) : new Date(),
    endDate: faculty?.endDate ? new Date(faculty.endDate) : new Date(),
  };
};

export default function FacultyEditor({
  defaultValues,
  status = 'ACTIVE',
  labs,
  onCancel,
  onSubmit,
  onDelete,
}: FacultyEditorProps) {
  const [language, setLanguage] = useState<Language>('ko');
  const formMethods = useForm<FacultyFormData>({
    defaultValues: {
      status: defaultValues?.status ?? status,
      ko: normalizeFacultyData(defaultValues?.ko),
      en: normalizeFacultyData(defaultValues?.en),
    },
    shouldFocusError: false,
  });
  const { handleSubmit } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <Form>
        <Fieldset title="구분" spacing="11" titleSpacing="3" required>
          <div className="flex gap-3">
            {Object.entries(FACULTY_STATUS).map(([status, label]) => (
              <Form.Radio
                key={status}
                value={status}
                label={label}
                name="status"
              />
            ))}
          </div>
        </Fieldset>

        <LanguagePicker selected={language} onChange={setLanguage} />
        {language === 'ko' && <Editor language="ko" labs={labs.ko} />}
        {language === 'en' && <Editor language="en" labs={labs.en} />}

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
  labs,
}: {
  language: Language;
  labs: SimpleResearchLab[];
}) => {
  const { control } = useFormContext<FacultyFormData>();
  const status = useWatch({ control, name: 'status' });

  return (
    <>
      {/* 기본 정보 */}
      <Fieldset title="이름" spacing="5" titleSpacing="2" required>
        <Form.Text
          name={`${language}.name`}
          maxWidth="max-w-[30rem]"
          options={{
            required: { value: true, message: '이름을 입력해주세요.' },
          }}
        />
      </Fieldset>

      <Fieldset title="직함" spacing="5" titleSpacing="2" required>
        <Form.Text
          name={`${language}.academicRank`}
          maxWidth="max-w-[30rem]"
          placeholder="예: 교수, 조교수, 명예교수 등"
          options={{
            required: { value: true, message: '직함을 입력해주세요.' },
          }}
        />
      </Fieldset>

      <Fieldset title="소속" spacing="10" titleSpacing="2">
        <Form.Text
          name={`${language}.department`}
          maxWidth="max-w-[30rem]"
          placeholder="예: 컴퓨터공학부"
        />
      </Fieldset>

      {/* 재직 기간 (역대 교수진만 활성화) */}
      <Form.Section
        title="재직 기간"
        spacing="10"
        titleSpacing="2"
        hidden={status === 'ACTIVE'}
      >
        <div className="flex w-[400px]">
          <Fieldset title="시작 날짜" titleSpacing="2">
            <Form.Date name={`${language}.startDate`} hideTime />
          </Fieldset>
          <Fieldset title="종료 날짜" titleSpacing="2">
            <Form.Date name={`${language}.endDate`} hideTime />
          </Fieldset>
        </div>
      </Form.Section>

      {/* 사진 */}
      <Fieldset title="사진" spacing="12" titleSpacing="2">
        <label
          htmlFor={`${language}.image`}
          className="mb-3 whitespace-pre-wrap text-sm font-normal tracking-wide text-neutral-500"
        >
          3:4 비율의 증명사진이 가장 적합합니다.
        </label>
        <Form.Image name={`${language}.image`} />
      </Fieldset>

      {/* 연구실 (현직 교수만 활성화) */}
      <Fieldset
        title="연구실"
        spacing="5"
        titleSpacing="2"
        hidden={status !== 'ACTIVE'}
      >
        <Form.Dropdown
          name={`${language}.labId`}
          contents={[
            { value: null, label: '선택 안 함' },
            ...labs.map((lab) => ({ value: lab.id, label: lab.name })),
          ]}
        />
      </Fieldset>

      {/* 학력, 연구 분야, 경력 */}
      <Fieldset title="학력" spacing="2.5" titleSpacing="2">
        <Form.TextList
          name={`${language}.educations`}
          placeholder="예: 서울대학교 컴퓨터공학 학사 (2003)"
        />
      </Fieldset>

      <Fieldset title="연구 분야" spacing="2.5" titleSpacing="2">
        <Form.TextList
          name={`${language}.researchAreas`}
          placeholder="예: 스마트 디바이스 최적화"
        />
      </Fieldset>

      <Fieldset title="경력" spacing="2.5" titleSpacing="2">
        <Form.TextList
          name={`${language}.careers`}
          placeholder="예: 2015.09. - 현재: 전임교수, 서울대학교 컴퓨터공학부"
        />
      </Fieldset>

      {/* 연락처 정보 */}
      <Form.Section title="연락처 정보" titleSpacing="3">
        <Fieldset title="위치" spacing="5" titleSpacing="2">
          <Form.Text
            name={`${language}.office`}
            maxWidth="max-w-[20rem]"
            placeholder="예: 301동 504호"
          />
        </Fieldset>
        <div className="flex w-2xl">
          <Fieldset title="전화번호" spacing="5" titleSpacing="2">
            <Form.Text
              name={`${language}.phone`}
              maxWidth="max-w-[20rem]"
              placeholder="예: (02) 880-7302"
            />
          </Fieldset>
          <Fieldset title="팩스" spacing="5" titleSpacing="2">
            <Form.Text name={`${language}.fax`} maxWidth="max-w-[20rem]" />
          </Fieldset>
        </div>

        <Fieldset title="이메일" spacing="5" titleSpacing="2">
          <Form.Text name={`${language}.email`} maxWidth="max-w-[25rem]" />
        </Fieldset>

        <Fieldset title="웹사이트 URL" spacing="5" titleSpacing="2">
          <Form.Text name={`${language}.website`} maxWidth="max-w-[25rem]" />
        </Fieldset>
      </Form.Section>
    </>
  );
};
