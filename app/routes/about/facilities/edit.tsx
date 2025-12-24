'use client';

import type { Route } from '.react-router/types/app/routes/about/facilities/+types/edit';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { LoaderFunctionArgs } from 'react-router';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import Fieldset from '~/components/common/form/Fieldset';
import Form from '~/components/common/form/Form';
import LanguagePicker, {
  type Language,
} from '~/components/common/form/LanguagePicker';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import type {
  FacilitiesResponse,
  Facility,
} from '~/types/api/v2/about/facilities';
import type { EditorImage } from '~/types/form';
import { fetchJson, fetchOk } from '~/utils/fetch';
import { FormData2 } from '~/utils/form';

interface FacilityFormData {
  ko: { name: string; description: string; locations: string[] };
  en: { name: string; description: string; locations: string[] };
  imageURL: EditorImage;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const idParam = url.searchParams.get('id');

  const facilities = await fetchJson<FacilitiesResponse>(
    `${BASE_URL}/v2/about/facilities`,
  );

  // id param으로 facility 찾기
  let selectedFacility = facilities[0];
  if (idParam) {
    const found = facilities.find(
      (item) =>
        item.ko.id.toString() === idParam || item.en.id.toString() === idParam,
    );
    if (found) selectedFacility = found;
  }

  return { facility: selectedFacility, allFacilities: facilities };
}

export default function FacilitiesEdit({ loaderData }: Route.ComponentProps) {
  const { facility, allFacilities } = loaderData;
  const navigate = useNavigate();
  const { locale } = useLanguage({});
  const [language, setLanguage] = useState<Language>('ko');
  const [_searchParams, setSearchParams] = useSearchParams();

  const defaultValues: FacilityFormData = {
    ko: {
      name: facility.ko.name,
      description: facility.ko.description,
      locations: facility.ko.locations,
    },
    en: {
      name: facility.en.name,
      description: facility.en.description,
      locations: facility.en.locations,
    },
    imageURL: facility.ko.imageURL && {
      type: 'UPLOADED_IMAGE',
      url: facility.ko.imageURL,
    },
  };

  const methods = useForm({ defaultValues, shouldFocusError: false });

  const onCancel = () => {
    navigate(`/${locale}/about/facilities`);
  };

  const onSubmit = methods.handleSubmit(async ({ ko, en, imageURL }) => {
    const formData = new FormData2();

    formData.appendJson('request', {
      ko,
      en,
      removeImage: defaultValues.imageURL !== null && imageURL === null,
    });
    formData.appendIfLocal('newMainImage', imageURL);

    try {
      await fetchOk(`/api/v2/about/facilities/${facility.ko.id}`, {
        method: 'PUT',
        body: formData,
      });

      toast.success('시설을 수정했습니다.');
      navigate(`/${locale}/about/facilities`);
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  });

  const handleFacilityChange = (newFacility: {
    ko: Facility;
    en: Facility;
  }) => {
    setSearchParams({ id: newFacility.ko.id.toString() });
    methods.reset({
      ko: {
        name: newFacility.ko.name,
        description: newFacility.ko.description,
        locations: newFacility.ko.locations,
      },
      en: {
        name: newFacility.en.name,
        description: newFacility.en.description,
        locations: newFacility.en.locations,
      },
      imageURL: newFacility.ko.imageURL && {
        type: 'UPLOADED_IMAGE',
        url: newFacility.ko.imageURL,
      },
    });
  };

  return (
    <PageLayout title="시설 안내 편집" titleSize="xl" padding="default">
      <FormProvider {...methods}>
        <Form>
          {/* Facility 선택 */}
          {allFacilities.length > 1 && (
            <div className="mb-8">
              <label
                htmlFor="facility-select"
                className="mb-2 block text-sm font-medium"
              >
                편집할 시설 선택
              </label>
              <select
                id="facility-select"
                value={facility.ko.id}
                onChange={(e) => {
                  const selected = allFacilities.find(
                    (f) => f.ko.id === Number(e.target.value),
                  );
                  if (selected) handleFacilityChange(selected);
                }}
                className="w-full max-w-md rounded-md border border-neutral-300 px-3 py-2"
              >
                {allFacilities.map((f) => (
                  <option key={f.ko.id} value={f.ko.id}>
                    {f.ko.name}
                  </option>
                ))}
              </select>
            </div>
          )}

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
            <p className="mb-3 whitespace-pre-wrap text-sm font-normal tracking-wide text-neutral-500">
              시설 대표 이미지입니다.
            </p>
            <Form.Image name="imageURL" />
          </Fieldset>

          <Form.Action onCancel={onCancel} onSubmit={onSubmit} />
        </Form>
      </FormProvider>
    </PageLayout>
  );
}
