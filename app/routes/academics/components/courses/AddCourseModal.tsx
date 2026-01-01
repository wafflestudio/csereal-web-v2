import { FormProvider, useForm } from 'react-hook-form';
import { useRevalidator } from 'react-router';
import { toast } from '~/components/ui/sonner';
import Fieldset from '~/components/form/Fieldset';
import Form from '~/components/form/Form';
import Button from '~/components/ui/Button';
import Dialog from '~/components/ui/Dialog';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import type { Course, StudentType } from '~/types/api/v2/academics';
import { CLASSIFICATION, GRADE } from '~/types/api/v2/academics';
import { fetchOk } from '~/utils/fetch';

const CREDIT = [1, 2, 3, 4];

export default function AddCourseModal({
  onClose,
  studentType,
}: {
  onClose: () => void;
  studentType: StudentType;
}) {
  const { t } = useLanguage({
    '교과목 추가': 'Add Course',
    교과목명: 'Course Name',
    '교과목 설명': 'Course Description',
    '교과목 번호': 'Course Number',
    '교과목 구분': 'Classification',
    학점: 'Credits',
    학년: 'Grade',
    '* 교과목 번호는 추후 수정할 수 없습니다.':
      '* Course number cannot be modified later.',
    '(영문) Course Name': 'Course Name',
    '(영문) Course Description': 'Course Description',
    취소: 'Cancel',
    추가하기: 'Add',
    '새 교과목을 추가했습니다.': 'Course added successfully.',
    '교과목을 추가하지 못했습니다.': 'Failed to add course.',
  });

  const formMethods = useForm<Course>({
    defaultValues: {
      code: '',
      credit: 3,
      grade: studentType === 'graduate' ? 0 : 1,
      studentType: studentType,
      ko: { name: '', description: '', classification: '전공필수' },
      en: { name: '', description: '', classification: 'RM' },
    },
    shouldFocusError: false,
  });
  const { handleSubmit } = formMethods;
  const revalidator = useRevalidator();

  const onSubmit = async (course: Course) => {
    try {
      await fetchOk(`${BASE_URL}/v2/academics/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      });
      toast.success(t('새 교과목을 추가했습니다.'));
      revalidator.revalidate();
      onClose();
    } catch {
      toast.error(t('교과목을 추가하지 못했습니다.'));
    }
  };

  return (
    <Dialog
      open
      onOpenChange={onClose}
      contentClassName="min-w-[500px] max-w-[768px]"
    >
      <FormProvider {...formMethods}>
        <h4 className="mb-4 text-xl font-bold text-neutral-700">
          {t('교과목 추가')}
        </h4>
        <div className="flex flex-col gap-4">
          <Fieldset title={t('교과목명')} titleSpacing="1" spacing="5" required>
            <Form.Text
              name="ko.name"
              maxWidth="max-w-[480px]"
              options={{ required: { value: true, message: t('교과목명') } }}
            />
          </Fieldset>
          <Fieldset
            title={t('교과목 설명')}
            titleSpacing="1"
            spacing="5"
            required
          >
            <Form.TextArea
              name="ko.description"
              placeholder={t('교과목 설명')}
              options={{ required: { value: true, message: t('교과목 설명') } }}
            />
          </Fieldset>
          <div className="flex justify-between">
            <Fieldset
              title={t('교과목 번호')}
              titleSpacing="1"
              grow={false}
              required
            >
              <Form.Text
                name="code"
                maxWidth="max-w-[140px]"
                options={{
                  required: { value: true, message: t('교과목 번호') },
                }}
              />
            </Fieldset>
            <DropdownFieldset
              title={t('교과목 구분')}
              contents={Object.keys(CLASSIFICATION).map((value) => ({
                value,
                label: value,
              }))}
              name="ko.classification"
              width="w-[94px]"
            />
            <DropdownFieldset
              title={t('학점')}
              name="credit"
              contents={CREDIT.map((value) => ({
                value,
                label: value.toString(),
              }))}
            />
            <DropdownFieldset
              title={t('학년')}
              contents={
                studentType === 'undergraduate'
                  ? GRADE.slice(1).map((label, idx) => ({
                      value: idx + 1,
                      label,
                    }))
                  : [{ value: 0, label: GRADE[0] }]
              }
              name="grade"
              width="w-[90px]"
            />
          </div>
          <div className="mb-10 mt-1.5 text-xs text-main-orange">
            {t('* 교과목 번호는 추후 수정할 수 없습니다.')}
          </div>
          <Fieldset
            title={t('(영문) Course Name')}
            titleSpacing="1"
            spacing="5"
            required
          >
            <Form.Text
              name="en.name"
              maxWidth="max-w-[480px]"
              options={{
                required: { value: true, message: t('(영문) Course Name') },
              }}
            />
          </Fieldset>
          <Fieldset
            title={t('(영문) Course Description')}
            titleSpacing="1"
            spacing="5"
            required
          >
            <Form.TextArea
              name="en.description"
              placeholder="course description"
              options={{
                required: {
                  value: true,
                  message: t('(영문) Course Description'),
                },
              }}
            />
          </Fieldset>
          <div className="flex justify-end gap-2">
            <Button variant="outline" tone="neutral" onClick={onClose}>
              {t('취소')}
            </Button>
            <Button
              variant="outline"
              tone="neutral"
              onClick={handleSubmit(onSubmit)}
            >
              {t('추가하기')}
            </Button>
          </div>
        </div>
      </FormProvider>
    </Dialog>
  );
}

function DropdownFieldset({
  title,
  contents,
  name,
  width,
}: {
  title: string;
  contents: { value: unknown; label: string }[];
  name: string;
  width?: string;
}) {
  return (
    <Fieldset title={title} titleSpacing="1" grow={false} required>
      <Form.Dropdown
        contents={contents}
        name={name}
        borderStyle="border-neutral-300"
        width={width}
        height="h-8"
      />
    </Fieldset>
  );
}
