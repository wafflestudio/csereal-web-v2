import type { Route } from '.react-router/types/app/routes/about/student-clubs/+types/edit';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { LoaderFunctionArgs } from 'react-router';
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
import type { StudentClubsResponse } from '~/types/api/v2/about/student-clubs';
import type { EditorImage } from '~/types/form';
import { fetchJson, fetchOk } from '~/utils/fetch';
import { FormData2 } from '~/utils/form';

interface ClubFormData {
  ko: { name: string; description: string };
  en: { name: string; description: string };
  image: EditorImage;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const selectedParam = url.searchParams.get('selected');

  const clubs = await fetchJson<StudentClubsResponse>(
    `${BASE_URL}/v2/about/student-clubs`,
  );

  // selected param으로 club 찾기
  const selectedClub =
    clubs.find((item) => item.ko.id.toString() === selectedParam) ?? clubs[0];

  return { club: selectedClub };
}

export default function StudentClubsEdit({ loaderData }: Route.ComponentProps) {
  const { club } = loaderData;
  const navigate = useNavigate();
  const { locale } = useLanguage({});
  const [language, setLanguage] = useState<Language>('ko');

  const defaultValues: ClubFormData = {
    ko: { name: club.ko.name, description: club.ko.description },
    en: { name: club.en.name, description: club.en.description },
    image: club.ko.imageURL && {
      type: 'UPLOADED_IMAGE',
      url: club.ko.imageURL,
    },
  };

  const methods = useForm({ defaultValues, shouldFocusError: false });

  const onCancel = () => {
    navigate(`/${locale}/about/student-clubs`);
  };

  const onSubmit = methods.handleSubmit(async ({ ko, en, image }) => {
    const formData = new FormData2();

    const removeImage = !!defaultValues.image && !image;
    formData.appendJson('request', {
      // TODO: 이거 prod에는 없었던거같은데...
      ko: { ...ko, id: club.ko.id },
      en: { ...en, id: club.en.id },
      removeImage,
    });
    formData.appendIfLocal('newMainImage', image);

    try {
      await fetchOk(`/api/v2/about/student-clubs`, {
        method: 'PUT',
        body: formData,
      });

      toast.success('동아리를 수정했습니다.');
      navigate(`/${locale}/about/student-clubs`);
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  });

  return (
    <PageLayout title="동아리 소개 편집" titleSize="xl" padding="default">
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
