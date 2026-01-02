import type { Route } from '.react-router/types/app/routes/about/directions/$id/+types/edit';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { LoaderFunctionArgs } from 'react-router';
import { useNavigate } from 'react-router';
import Fieldset from '~/components/form/Fieldset';
import Form from '~/components/form/Form';
import LanguagePicker, {
  type Language,
} from '~/components/form/LanguagePicker';
import PageLayout from '~/components/layout/PageLayout';
import { toast } from '~/components/ui/sonner';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import type { DirectionsResponse } from '~/types/api/v2/about/directions';
import { fetchJson, fetchOk } from '~/utils/fetch';

interface DirectionFormData {
  htmlKo: string;
  htmlEn: string;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const id = Number(params.id);

  if (!id || Number.isNaN(id)) {
    throw new Response('Invalid ID', { status: 400 });
  }

  const directions = await fetchJson<DirectionsResponse>(
    `${BASE_URL}/v2/about/directions`,
  );

  const direction = directions.find((d) => d.ko.id === id);

  if (!direction) {
    throw new Response('Direction not found', { status: 404 });
  }

  return { direction };
}

export default function DirectionsEdit({ loaderData }: Route.ComponentProps) {
  const { direction } = loaderData;
  const navigate = useNavigate();
  const { locale } = useLanguage({});
  const [language, setLanguage] = useState<Language>('ko');

  const defaultValues: DirectionFormData = {
    htmlKo: direction.ko.description,
    htmlEn: direction.en.description,
  };

  const methods = useForm({ defaultValues, shouldFocusError: false });

  const onCancel = () => {
    navigate(`/${locale}/about/directions`);
  };

  const onSubmit = methods.handleSubmit(async ({ htmlKo, htmlEn }) => {
    try {
      await fetchOk(`/api/v2/about/directions/${direction.ko.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          koDescription: htmlKo,
          enDescription: htmlEn,
        }),
      });

      toast.success('찾아오는 길을 수정했습니다.');
      navigate(`/${locale}/about/directions`);
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  });

  return (
    <PageLayout
      title={`찾아오는 길(${direction.ko.name}) 편집`}
      titleSize="xl"
      padding="default"
    >
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

          <Form.Action onCancel={onCancel} onSubmit={onSubmit} />
        </Form>
      </FormProvider>
    </PageLayout>
  );
}
