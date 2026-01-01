import type { Route } from '.react-router/types/app/routes/about/overview/+types/edit';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from '~/components/ui/sonner';
import Fieldset from '~/components/form/Fieldset';
import Form from '~/components/form/Form';
import LanguagePicker, {
  type Language,
} from '~/components/form/LanguagePicker';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import type { AboutContent } from '~/types/api/v2/about/content';
import type { EditorFile, EditorImage } from '~/types/form';
import { LOCALES } from '~/types/i18n';
import { fetchJson, fetchOk } from '~/utils/fetch';
import { FormData2, getDeleteIds } from '~/utils/form';

interface OverviewFormData {
  htmlKo: string;
  htmlEn: string;
  image: EditorImage;
  files: EditorFile[];
}

export async function loader() {
  const [koData, enData] = await Promise.all(
    LOCALES.map((locale) =>
      fetchJson<AboutContent>(
        `${BASE_URL}/v2/about/overview?language=${locale}`,
      ),
    ),
  );

  return { koData, enData };
}

export default function OverviewEdit({ loaderData }: Route.ComponentProps) {
  const { koData, enData } = loaderData;
  const navigate = useNavigate();
  const { locale } = useLanguage({});
  const [language, setLanguage] = useState<Language>('ko');

  const defaultValues: OverviewFormData = {
    htmlKo: koData.description,
    htmlEn: enData.description,
    image: koData.imageURL && { type: 'UPLOADED_IMAGE', url: koData.imageURL },
    files: koData.attachments.map(
      (file): EditorFile => ({ type: 'UPLOADED_FILE', file }),
    ),
  };

  const methods = useForm({ defaultValues, shouldFocusError: false });

  const onCancel = () => {
    navigate(`/${locale}/about/overview`);
  };

  const onSubmit = methods.handleSubmit(
    async ({ htmlKo, htmlEn, image, files }) => {
      const formData = new FormData2();

      const deleteIds = getDeleteIds({ prev: defaultValues.files, cur: files });

      formData.appendJson('request', {
        ko: { description: htmlKo, deleteIds },
        en: { description: htmlEn, deleteIds: [] },
        removeImage: defaultValues.image !== null && image === null,
      });
      formData.appendIfLocal('newMainImage', image);
      formData.appendIfLocal('newAttachments', files);

      try {
        await fetchOk(`/api/v2/about/overview`, {
          method: 'PUT',
          body: formData,
        });

        toast.success('학부 소개를 수정했습니다.');
        navigate(`/${locale}/about/overview`);
      } catch {
        toast.error('수정에 실패했습니다.');
      }
    },
  );

  return (
    <PageLayout title="학부 소개 편집" titleSize="xl" padding="default">
      <FormProvider {...methods}>
        <Form>
          <LanguagePicker onChange={setLanguage} selected={language} />

          <Fieldset.HTML>
            <Form.HTML
              name="htmlKo"
              options={{
                required: {
                  value: true,
                  message: '한국어 내용을 입력해주세요.',
                },
              }}
              isHidden={language === 'en'}
            />
            <Form.HTML
              name="htmlEn"
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

          <Fieldset.File>
            <Form.File name="files" />
          </Fieldset.File>

          <Form.Action onCancel={onCancel} onSubmit={onSubmit} />
        </Form>
      </FormProvider>
    </PageLayout>
  );
}
