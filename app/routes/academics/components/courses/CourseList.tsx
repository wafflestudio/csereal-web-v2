import { useLanguage } from '~/hooks/useLanguage';
import type { Course } from '~/types/api/v2/academics';
import { GRADE } from '~/types/api/v2/academics';
import translations from './translations.json';

interface CourseListProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
}

export default function CourseList({
  courses,
  onSelectCourse,
}: CourseListProps) {
  return (
    <div className="border-b border-neutral-200 sm:ml-5">
      <Header />
      <ul className="sm:divide-y sm:divide-dashed sm:divide-neutral-200">
        {courses.map((course) => (
          <Row
            key={course.code}
            course={course}
            onSelectCourse={onSelectCourse}
          />
        ))}
      </ul>
    </div>
  );
}

const COURSE_ROW_ITEM_WIDTH = {
  name: 'sm:w-[16rem]',
  classification: 'sm:w-[10rem]',
  code: 'sm:w-[13rem]',
  credit: 'sm:w-[6rem]',
  grade: 'sm:w-[5.25rem]',
} as const;

const Header = () => {
  const { t } = useLanguage(translations);

  return (
    <h5 className="hidden h-11 items-center whitespace-nowrap border-y border-neutral-100 bg-neutral-100 px-4 text-md sm:flex">
      <span className={COURSE_ROW_ITEM_WIDTH.name}>{t('교과목명')}</span>
      <span className={COURSE_ROW_ITEM_WIDTH.classification}>
        {t('교과목 구분')}
      </span>
      <span className={COURSE_ROW_ITEM_WIDTH.code}>{t('교과목 번호')}</span>
      <span className={COURSE_ROW_ITEM_WIDTH.credit}>{t('학점')}</span>
      <span className={COURSE_ROW_ITEM_WIDTH.grade}>{t('학년')}</span>
    </h5>
  );
};

const Row = ({
  course,
  onSelectCourse,
}: {
  course: Course;
  onSelectCourse: (course: Course) => void;
}) => {
  const { locale } = useLanguage(translations);
  const { t } = useLanguage(translations);

  return (
    <li className="grid grid-cols-[auto_auto_1fr] grid-rows-3 gap-1 px-7 py-6 text-md odd:bg-neutral-50 sm:flex sm:h-14 sm:items-center sm:gap-0 sm:px-4 sm:py-0 sm:odd:bg-white">
      <span
        className={`${COURSE_ROW_ITEM_WIDTH.name} order-1 col-span-3 pr-2 text-base font-semibold sm:text-md sm:font-normal`}
      >
        <button
          className="text-left"
          type="button"
          onClick={() => onSelectCourse(course)}
        >
          {course[locale].name}
        </button>
      </span>
      <span
        className={`${COURSE_ROW_ITEM_WIDTH.classification} order-3 whitespace-nowrap pr-1 text-neutral-400 sm:order-2 sm:pr-0`}
      >
        {course[locale].classification}
      </span>
      <span
        className={`${COURSE_ROW_ITEM_WIDTH.code} order-2 col-span-3 text-neutral-500 sm:order-3 sm:text-neutral-400`}
      >
        {course.code}
      </span>
      <span
        className={`${COURSE_ROW_ITEM_WIDTH.credit} order-5 text-neutral-400 sm:order-4 sm:pl-2`}
      >
        {course.credit}
        <span className="sm:hidden">{t('학점')}</span>
      </span>
      <span
        className={`${COURSE_ROW_ITEM_WIDTH.grade} order-4 whitespace-nowrap pr-1 text-neutral-400 sm:order-5 sm:pr-0`}
      >
        {t(GRADE[course.grade])}
      </span>
    </li>
  );
};
