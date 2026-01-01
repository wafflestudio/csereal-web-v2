import { FormProvider, useForm } from 'react-hook-form';
import { useRevalidator } from 'react-router';
import { toast } from '~/components/ui/sonner';
import Form from '~/components/form/Form';
import Button from '~/components/ui/Button';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import {
  CLASSIFICATION,
  type ClassificationEn,
  type Course,
  GRADE,
} from '~/types/api/v2/academics';
import { fetchOk } from '~/utils/fetch';
import BookmarkIcon from './assets/bookmark_icon.svg?react';

const CREDIT = [1, 2, 3, 4];

export default function CourseEditor({
  defaultValues,
  toggleEditMode,
  setCourse,
}: {
  defaultValues: Course;
  toggleEditMode: () => void;
  setCourse: (course: Course) => void;
}) {
  const { t } = useLanguage({
    '교과목을 수정했습니다.': 'Course updated successfully.',
    '교과목을 수정하지 못했습니다.': 'Failed to update course.',
    '교과목 코드는 수정할 수 없습니다': 'Course code cannot be modified',
    교과목명: 'Course Name',
    '교과목 설명': 'Course Description',
    취소: 'Cancel',
    확인: 'Confirm',
    영문: 'English',
  });
  const revalidator = useRevalidator();

  const formMethods = useForm<Course>({
    defaultValues,
    shouldFocusError: false,
  });
  const { setValue, handleSubmit } = formMethods;
  const gradeDropdownContents =
    defaultValues.grade === 0 ? [GRADE[0]] : GRADE.slice(1);

  const onSubmit = async (course: Course) => {
    try {
      await fetchOk(`${BASE_URL}/v2/academics/courses`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      });
      setCourse(course);
      toggleEditMode();
      toast.success(t('교과목을 수정했습니다.'));
      revalidator.revalidate();
    } catch {
      toast.error(t('교과목을 수정하지 못했습니다.'));
    }
  };

  return (
    <FormProvider {...formMethods}>
      <h4 className="flex flex-wrap items-center gap-2">
        <BookmarkIcon />
        <Form.Text
          name="ko.name"
          maxWidth="w-[180px]"
          placeholder={t('교과목명')}
          options={{ required: { value: true, message: t('교과목명') } }}
        />
        {/** biome-ignore lint/a11y/noStaticElementInteractions: TODO */}
        {/** biome-ignore lint/a11y/useKeyWithClickEvents: TODO */}
        <div
          className="h-8 w-[120px] cursor-default rounded-sm border border-neutral-300 pl-2 text-sm leading-[31px] text-neutral-400"
          onClick={() => toast.error(t('교과목 코드는 수정할 수 없습니다'))}
        >
          {defaultValues.code}
        </div>
        <Form.Dropdown
          contents={Object.keys(CLASSIFICATION).map((value) => ({
            label: value,
            value,
          }))}
          name="ko.classification"
          borderStyle="border-neutral-300"
          height="h-8"
          width="w-[94px]"
          onChange={(value) =>
            setValue('en.classification', value as ClassificationEn)
          }
        />
        <Form.Dropdown
          contents={CREDIT.map((value) => ({ label: value.toString(), value }))}
          name="credit"
          borderStyle="border-neutral-300"
          height="h-8"
        />
        <Form.Dropdown
          contents={gradeDropdownContents.map((label, idx) => ({
            value: defaultValues.grade === 0 ? 0 : idx + 1,
            label,
          }))}
          name="grade"
          borderStyle="border-neutral-300"
          height="h-8"
          width="w-[90px]"
        />
      </h4>
      <Form.TextArea
        name="ko.description"
        placeholder={t('교과목 설명')}
        options={{ required: { value: true, message: t('교과목 설명') } }}
      />
      <div>
        <div className="mb-4 flex items-center gap-2.5">
          <span className="text-md text-neutral-400">{t('영문')}</span>
          <Form.Text
            name="en.name"
            maxWidth="w-[308px]"
            placeholder="course name"
            options={{ required: { value: true, message: 'course name' } }}
          />
        </div>
        <Form.TextArea
          name="en.description"
          placeholder="course description"
          options={{ required: { value: true, message: 'course description' } }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" tone="neutral" onClick={toggleEditMode}>
          {t('취소')}
        </Button>
        <Button variant="solid" tone="neutral" onClick={handleSubmit(onSubmit)}>
          {t('확인')}
        </Button>
      </div>
    </FormProvider>
  );
}
