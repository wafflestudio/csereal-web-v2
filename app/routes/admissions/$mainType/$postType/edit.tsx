import type { Route } from '.react-router/types/app/routes/admissions/$mainType/$postType/+types/edit';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import Fieldset from '~/components/common/form/Fieldset';
import Form from '~/components/common/form/Form';
import LanguagePicker, {
  type Language,
} from '~/components/common/form/LanguagePicker';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import type { AdmissionsResponse } from '~/types/api/v2/admissions';
import { fetchJson, fetchOk } from '~/utils/fetch';

const ADMISSIONS_PAGES: Record<
  string,
  Record<string, { title: string; apiPostType: string; successMessage: string }>
> = {
  undergraduate: {
    'regular-admission': {
      title: '학부 정시 모집 편집',
      apiPostType: 'regular-admission',
      successMessage: '학부 정시 모집 본문을 수정했습니다.',
    },
    'early-admission': {
      title: '학부 수시 모집 편집',
      apiPostType: 'early-admission',
      successMessage: '학부 수시 모집 본문을 수정했습니다.',
    },
  },
  graduate: {
    'regular-admission': {
      title: '대학원 입학 편집',
      apiPostType: 'regular-admission',
      successMessage: '대학원 입학 본문을 수정했습니다.',
    },
  },
  international: {
    undergraduate: {
      title: '외국인 학부 입학 편집',
      apiPostType: 'undergraduate',
      successMessage: '외국인 학부 입학 본문을 수정했습니다.',
    },
    graduate: {
      title: '외국인 대학원 입학 편집',
      apiPostType: 'graduate',
      successMessage: '외국인 대학원 입학 본문을 수정했습니다.',
    },
    exchange: {
      title: '교환/방문학생 프로그램 편집',
      apiPostType: 'exchange-visiting',
      successMessage: '교환/방문학생 프로그램 본문을 수정했습니다.',
    },
    scholarships: {
      title: '외국인 장학금 편집',
      apiPostType: 'scholarships',
      successMessage: '외국인 장학금 본문을 수정했습니다.',
    },
  },
};

export async function loader({ params }: Route.LoaderArgs) {
  const { mainType, postType } = params;
  const config = ADMISSIONS_PAGES[mainType]?.[postType];

  if (!config) {
    throw new Error(`Invalid admissions page: ${mainType}/${postType}`);
  }

  const data = await fetchJson<AdmissionsResponse>(
    `${BASE_URL}/v2/admissions/${mainType}/${config.apiPostType}`,
  );

  return {
    ko: data.ko.description,
    en: data.en.description,
    mainType,
    postType,
  };
}

export default function AdmissionsEdit({ loaderData }: Route.ComponentProps) {
  const { ko, en, mainType, postType } = loaderData;
  const navigate = useNavigate();
  const { locale } = useLanguage({});
  const [language, setLanguage] = useState<Language>('ko');

  const config = ADMISSIONS_PAGES[mainType][postType];
  const { title, apiPostType, successMessage } = config;

  const methods = useForm({
    defaultValues: { ko, en },
    shouldFocusError: false,
  });

  const onCancel = () => {
    navigate(`/${locale}/admissions/${mainType}/${postType}`);
  };

  const onSubmit = methods.handleSubmit(async ({ ko, en }) => {
    try {
      await fetchOk(`/api/v2/admissions/${mainType}/${apiPostType}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ko, en }),
      });
      toast.success(successMessage);
      navigate(`/${locale}/admissions/${mainType}/${postType}`);
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  });

  return (
    <PageLayout title={title} titleSize="xl" padding="default">
      <FormProvider {...methods}>
        <Form>
          <LanguagePicker onChange={setLanguage} selected={language} />
          <Fieldset.HTML>
            <Form.HTML
              name="ko"
              options={{
                required: {
                  value: true,
                  message: '한국어 내용을 입력해주세요.',
                },
              }}
              isHidden={language === 'en'}
            />
            <Form.HTML
              name="en"
              options={{
                required: { value: true, message: '영문 내용을 입력해주세요.' },
              }}
              isHidden={language === 'ko'}
            />
          </Fieldset.HTML>
          <Form.Action onCancel={onCancel} onSubmit={onSubmit} />
        </Form>
      </FormProvider>
    </PageLayout>
  );
}
