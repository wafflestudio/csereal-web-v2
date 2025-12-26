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

interface ClubFormData {
  ko: { name: string; description: string };
  en: { name: string; description: string };
  image: EditorImage;
}

export default function StudentClubsCreate() {
  const navigate = useNavigate();
  const { locale } = useLanguage({});
  const [language, setLanguage] = useState<Language>('ko');

  const defaultValues: ClubFormData = {
    ko: { name: '', description: '' },
    en: { name: '', description: '' },
    image: null,
  };

  const methods = useForm({ defaultValues, shouldFocusError: false });

  const onCancel = () => {
    navigate(`/${locale}/about/student-clubs`);
  };

  const onSubmit = methods.handleSubmit(async ({ ko, en, image }) => {
    const formData = new FormData2();

    formData.appendJson('request', { ko, en });
    formData.appendIfLocal('newMainImage', image);

    try {
      await fetchOk('/api/v2/about/student-clubs', {
        method: 'POST',
        body: formData,
      });

      toast.success('동아리를 추가했습니다.');
      navigate(`/${locale}/about/student-clubs`);
    } catch {
      toast.error('추가에 실패했습니다.');
    }
  });

  return (
    <PageLayout title="동아리 추가" titleSize="xl" padding="default">
      <FormProvider {...methods}>
        <Form>
          <LanguagePicker onChange={setLanguage} selected={language} />

          <Fieldset.Title>
            <Form.Text
              name="ko.name"
              options={{
                required: {
                  value: true,
                  message: '한국어 제목을 입력해주세요.',
                },
              }}
              hidden={language === 'en'}
            />
            <Form.Text
              name="en.name"
              options={{
                required: { value: true, message: '영문 제목을 입력해주세요.' },
              }}
              hidden={language === 'ko'}
            />
          </Fieldset.Title>

          <Fieldset.HTML>
            <Form.HTML
              name="ko.description"
              options={{
                required: {
                  value: true,
                  message: '한국어 내용을 입력해주세요.',
                },
              }}
              isHidden={language === 'en'}
            />
            <Form.HTML
              name="en.description"
              options={{
                required: { value: true, message: '영문 내용을 입력해주세요.' },
              }}
              isHidden={language === 'ko'}
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

          <Form.Action onCancel={onCancel} onSubmit={onSubmit} />
        </Form>
      </FormProvider>
    </PageLayout>
  );
}
