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
import { useLanguage } from '~/hooks/useLanguage';
import type { EditorImage } from '~/types/form';
import { fetchOk } from '~/utils/fetch';
import { FormData2 } from '~/utils/form';

interface FacilityFormData {
  ko: { name: string; description: string; locations: string[] };
  en: { name: string; description: string; locations: string[] };
  imageURL: EditorImage;
}

export default function FacilitiesCreate() {
  const navigate = useNavigate();
  const { locale } = useLanguage({});
  const [language, setLanguage] = useState<Language>('ko');

  const defaultValues: FacilityFormData = {
    ko: { name: '', description: '', locations: [] },
    en: { name: '', description: '', locations: [] },
    imageURL: null,
  };

  const methods = useForm({ defaultValues, shouldFocusError: false });

  const onCancel = () => {
    navigate(`/${locale}/about/facilities`);
  };

  const onSubmit = methods.handleSubmit(async ({ ko, en, imageURL }) => {
    const formData = new FormData2();

    formData.appendJson('request', { ko, en });
    formData.appendIfLocal('newMainImage', imageURL);

    try {
      await fetchOk('/api/v2/about/facilities', {
        method: 'POST',
        body: formData,
      });

      toast.success('시설을 추가했습니다.');
      navigate(`/${locale}/about/facilities`);
    } catch {
      toast.error('추가에 실패했습니다.');
    }
  });

  return (
    <PageLayout title="시설 추가" titleSize="xl" padding="default">
      <FormProvider {...methods}>
        <Form>
          <LanguagePicker onChange={setLanguage} selected={language} />

          <Fieldset title="시설명" spacing="8" required>
            {language === 'ko' && (
              <Form.Text
                name="ko.name"
                maxWidth="max-w-[30rem]"
                options={{
                  required: { value: true, message: '시설명을 입력해주세요.' },
                }}
              />
            )}
            {language === 'en' && (
              <Form.Text
                name="en.name"
                maxWidth="max-w-[30rem]"
                options={{
                  required: { value: true, message: '시설명을 입력해주세요.' },
                }}
              />
            )}
          </Fieldset>

          <Fieldset title="시설 설명" spacing="10" required>
            {language === 'ko' && (
              <Form.HTML
                name="ko.description"
                options={{
                  required: {
                    value: true,
                    message: '시설 설명을 입력해주세요.',
                  },
                }}
              />
            )}
            {language === 'en' && (
              <Form.HTML
                name="en.description"
                options={{
                  required: {
                    value: true,
                    message: '시설 설명을 입력해주세요.',
                  },
                }}
              />
            )}
          </Fieldset>

          <Fieldset title="시설 위치" spacing="8" required>
            {language === 'ko' && (
              <Form.TextList
                name="ko.locations"
                placeholder="예: 301동 315호"
              />
            )}
            {language === 'en' && (
              <Form.TextList
                name="en.locations"
                placeholder="예: 301동 315호"
              />
            )}
          </Fieldset>

          <Fieldset title="시설 사진" spacing="12">
            <label
              htmlFor="imageURL"
              className="mb-3 whitespace-pre-wrap text-sm font-normal tracking-wide text-neutral-500"
            >
              시설 대표 이미지입니다.
            </label>
            <Form.Image name="imageURL" />
          </Fieldset>

          <Form.Action onCancel={onCancel} onSubmit={onSubmit} />
        </Form>
      </FormProvider>
    </PageLayout>
  );
}
