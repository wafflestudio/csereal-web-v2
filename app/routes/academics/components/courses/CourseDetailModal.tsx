import { useEffect, useReducer, useState } from 'react';
import { useRevalidator } from 'react-router';
import { toast } from '~/components/ui/sonner';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import AlertDialog from '~/components/ui/AlertDialog';
import Button from '~/components/ui/Button';
import Dialog from '~/components/ui/Dialog';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import type { Course } from '~/types/api/v2/academics';
import { GRADE } from '~/types/api/v2/academics';
import { fetchOk } from '~/utils/fetch';
import BookmarkIcon from './assets/bookmark_icon.svg?react';
import CourseEditor from './CourseEditor';
import translations from './translations.json';

interface CourseDetailModalProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CourseDetailModal({
  course: initCourse,
  open,
  onOpenChange,
}: CourseDetailModalProps) {
  const [course, setCourse] = useState(initCourse);
  const [isEditMode, toggleEditMode] = useReducer((x) => !x, false);

  useEffect(() => {
    setCourse(initCourse);
  }, [initCourse]);

  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} ariaLabel="교과목 상세">
      <div className="flex flex-col gap-4">
        {isEditMode ? (
          <CourseEditor
            defaultValues={course}
            toggleEditMode={toggleEditMode}
            setCourse={setCourse}
          />
        ) : (
          <CourseViewer
            course={course}
            onClickEdit={toggleEditMode}
            onClose={() => onOpenChange(false)}
          />
        )}
      </div>
    </Dialog>
  );
}

function CourseViewer({
  course,
  onClickEdit,
  onClose,
}: {
  course: Course;
  onClickEdit: () => void;
  onClose: () => void;
}) {
  const { t, locale } = useLanguage(translations);
  const language = locale === 'en' ? 'en' : 'ko';
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const revalidator = useRevalidator();

  const handleDelete = async () => {
    try {
      await fetchOk(`${BASE_URL}/v2/academics/courses/${course.code}`, {
        method: 'DELETE',
      });
      setShowDeleteDialog(false);
      toast.success('교과목을 삭제했습니다.');
      revalidator.revalidate();
      onClose();
    } catch {
      toast.error('교과목을 삭제하지 못했습니다.');
    }
  };

  return (
    <>
      <CourseHeader
        name={course[language].name}
        code={course.code}
        classification={course[language].classification}
        credit={`${course.credit}${t('학점')}`}
        grade={t(GRADE[course.grade])}
      />
      <p className="text-md leading-loose">{course[language].description}</p>

      <LoginVisible allow="ROLE_STAFF">
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            tone="neutral"
            onClick={() => setShowDeleteDialog(true)}
          >
            {t('삭제')}
          </Button>
          <Button variant="outline" tone="neutral" onClick={onClickEdit}>
            {t('편집')}
          </Button>
        </div>
      </LoginVisible>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        description={t('삭제하시겠습니까?')}
        confirmText={t('삭제')}
        onConfirm={handleDelete}
      />
    </>
  );
}

interface CourseHeaderProps {
  name: string;
  code: string;
  classification: string;
  credit: string;
  grade: string;
}

function CourseHeader({
  name,
  code,
  classification,
  credit,
  grade,
}: CourseHeaderProps) {
  return (
    <h4 className="flex flex-wrap items-center gap-2">
      <BookmarkIcon className="h-[24px] w-[24px]" />
      <span className="font-bold">{name}</span>
      <div className="flex items-center divide-x divide-neutral-200 pt-1 text-sm text-neutral-600 [&_span]:px-2">
        <span>{code}</span>
        <span>{classification}</span>
        <span>{credit}</span>
        <span>{grade}</span>
      </div>
    </h4>
  );
}
