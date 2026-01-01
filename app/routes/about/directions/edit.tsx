import type { Route } from '.react-router/types/app/routes/about/directions/+types/edit';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { LoaderFunctionArgs } from 'react-router';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from '~/components/ui/sonner';
import Fieldset from '~/components/form/Fieldset';
import Form from '~/components/form/Form';
import LanguagePicker, {
  type Language,
} from '~/components/form/LanguagePicker';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import type {
  Direction,
  DirectionsResponse,
} from '~/types/api/v2/about/directions';
import { fetchJson, fetchOk } from '~/utils/fetch';

interface DirectionFormData {
  htmlKo: string;
  htmlEn: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const selectedParam = url.searchParams.get('selected');

  const directions = await fetchJson<DirectionsResponse>(
    `${BASE_URL}/v2/about/directions`,
  );

  // selected param으로 direction 찾기
  let selectedDirection = directions[0];
  if (selectedParam) {
    const found = directions.find(
      (item) =>
        item.ko.name === selectedParam || item.en.name === selectedParam,
    );
    if (found) selectedDirection = found;
  }

  return { direction: selectedDirection, allDirections: directions };
}

export default function DirectionsEdit({ loaderData }: Route.ComponentProps) {
  const { direction, allDirections } = loaderData;
  const navigate = useNavigate();
  const { locale } = useLanguage({});
  const [language, setLanguage] = useState<Language>('ko');
  const [_searchParams, setSearchParams] = useSearchParams();

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

      toast.success('교육 및 연구 분야를 수정했습니다.');
      navigate(`/${locale}/about/directions`);
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  });

  const handleDirectionChange = (newDirection: {
    ko: Direction;
    en: Direction;
  }) => {
    setSearchParams({ selected: newDirection.ko.name });
    methods.reset({
      htmlKo: newDirection.ko.description,
      htmlEn: newDirection.en.description,
    });
  };

  return (
    <PageLayout
      title={`찾아오는 길(${direction.ko.name}) 편집`}
      titleSize="xl"
      padding="default"
    >
      <FormProvider {...methods}>
        <Form>
          {/* Direction 선택 */}
          {allDirections.length > 1 && (
            <div className="mb-8">
              <label
                htmlFor="direction-select"
                className="mb-2 block text-sm font-medium"
              >
                편집할 항목 선택
              </label>
              <select
                id="direction-select"
                value={direction.ko.id}
                onChange={(e) => {
                  const selected = allDirections.find(
                    (d) => d.ko.id === Number(e.target.value),
                  );
                  if (selected) handleDirectionChange(selected);
                }}
                className="w-full max-w-md rounded-md border border-neutral-300 px-3 py-2"
              >
                {allDirections.map((d) => (
                  <option key={d.ko.id} value={d.ko.id}>
                    {d.ko.name}
                  </option>
                ))}
              </select>
            </div>
          )}

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
