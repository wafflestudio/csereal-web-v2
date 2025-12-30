import clsx from 'clsx';
import { type RefObject, useEffect, useReducer, useRef } from 'react';
import { useLanguage } from '~/hooks/useLanguage';
import type { SortOption } from '~/types/academics';
import type { Course } from '~/types/api/v2/academics';
import { GRADE } from '~/types/api/v2/academics';
import styles from './style.module.css';
import translations from './translations.json';

interface CourseCardProps {
  course: Course;
  selectedOption: SortOption;
}

const useSortedProperties = (course: Course, selectedOption: SortOption) => {
  const { t, locale } = useLanguage(translations);

  const classification = course[locale].classification;
  const grade = t(GRADE[course.grade]);
  const credit = `${course.credit}${t('학점')}`;

  switch (selectedOption) {
    case '교과목 구분':
      return [classification, grade, credit];
    case '학점':
      return [credit, grade, classification];
    case '학년':
      return [grade, classification, credit];
  }
};

const CARD_HEIGHT = 176; // px
const LINE_LIMIT = 6;
const TEXT_SIZE = 11; // px

export default function CourseCard({
  course,
  selectedOption,
}: CourseCardProps) {
  const sortedProperties = useSortedProperties(course, selectedOption);
  const [isFlipped, flipCard] = useReducer((x) => !x, false);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const { locale } = useLanguage(translations);
  const language = locale === 'en' ? 'en' : 'ko';

  useEffect(() => {
    const front = frontRef.current;
    const back = backRef.current;
    if (!front || !back) return;

    if (isFlipped) {
      if (back.scrollHeight > CARD_HEIGHT) {
        const textCount = back.innerText.split('\n')[2]?.length ?? 0;
        const letterPerLine = textCount / LINE_LIMIT;
        const expectedWidth = letterPerLine * TEXT_SIZE;
        back.style.width = `${expectedWidth}px`;
      }
    } else {
      back.style.width = `${front.offsetWidth}px`;
    }
  }, [isFlipped]);

  const courseName = course[language].name;
  const courseDescription = course[language].description;

  return (
    <button type="button" className={styles.card} onClick={flipCard}>
      <CourseCardFront
        ref={frontRef}
        isFlipped={isFlipped}
        sortedProperties={sortedProperties}
        name={courseName}
        code={course.code}
        description={courseDescription}
      />
      <CourseCardBack
        ref={backRef}
        isFlipped={isFlipped}
        name={courseName}
        code={course.code}
        description={courseDescription}
      />
    </button>
  );
}

interface CourseCardFaceProps {
  isFlipped: boolean;
  name: string;
  code: string;
  description: string;
  ref?: RefObject<HTMLDivElement | null>;
}

interface CourseCardFrontProps extends CourseCardFaceProps {
  sortedProperties: string[];
}

function CourseCardFront({
  isFlipped,
  sortedProperties,
  name,
  code,
  description,
  ref,
}: CourseCardFrontProps) {
  return (
    <div
      className={clsx(
        'absolute p-4.5 bg-neutral-50 hover:bg-neutral-100 active:bg-neutral-50',
        isFlipped
          ? 'transform-[rotateY(-180deg)]'
          : 'transform-[rotateY(0deg)]',
        'shadow-[2px_2px_4px_0_rgba(255,255,255,0.05)_inset,-2px_-2px_6px_0_rgba(0,0,0,0.05)_inset]',
        styles.face,
      )}
      ref={ref}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-[26px] items-center whitespace-nowrap rounded-[1.875rem] border bg-white px-2.5 text-sm font-medium text-main-orange">
          {sortedProperties[0]}
        </div>
        <span className="ml-2 whitespace-nowrap text-xs text-neutral-500">
          <span className="mr-2">{sortedProperties[1]}</span>
          <span>{sortedProperties[2]}</span>
        </span>
      </div>
      <h2 className="mb-2 whitespace-nowrap text-start">
        <span className="mr-2 text-base font-bold leading-normal">{name}</span>
        <span className="text-xs leading-normal text-neutral-500">{code}</span>
      </h2>
      <div className="flex">
        <p className="line-clamp-2 w-0 grow text-xs leading-normal text-neutral-500 text-start">
          {description}
        </p>
      </div>
    </div>
  );
}

function CourseCardBack({
  isFlipped,
  name,
  code,
  description,
  ref,
}: CourseCardFaceProps) {
  return (
    <div
      className={clsx(
        'py-5 px-4.5 bg-neutral-200',
        isFlipped ? 'transform-[rotateY(0deg)]' : 'transform-[rotateY(180deg)]',
        'shadow-[2px_2px_4px_0_rgba(255,255,255,0.07)_inset,-2px_-2px_4px_0_rgba(0,0,0,0.05)_inset]',
        styles.face,
      )}
      ref={ref}
    >
      <h2 className="mb-2 whitespace-nowrap text-start">
        <span className="mr-2 text-base font-bold leading-normal">{name}</span>
        <span className="text-xs leading-normal text-neutral-500">{code}</span>
      </h2>
      <div className="flex">
        <p className="w-0 grow text-xs leading-normal text-start">
          {description}
        </p>
      </div>
    </div>
  );
}
