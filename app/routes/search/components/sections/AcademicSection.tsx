import { useLanguage } from '~/hooks/useLanguage';
import type { Academic, AcademicsSearchResult } from '~/types/api/v2/search';
import BasicRow from '../ui/BasicRow';
import Section from '../ui/Section';

type TranslationKey = keyof typeof import('~/translations.json');

export default function AcademicSection({
  academic,
}: {
  academic: AcademicsSearchResult;
}) {
  const { t } = useLanguage();

  return (
    <Section title="학사 및 교과" size={academic.total} sectionId="academics">
      <div className="flex flex-col gap-7">
        {academic.results.map((result) => {
          const { path, itemLabel, parentLabel } = toAcademicInfo(result);

          return (
            <BasicRow
              key={result.id}
              href={path}
              title={result.name}
              metaLabel={`${t(parentLabel)} > ${t(itemLabel)}`}
              metaHref={path}
              partialDescription={result.partialDescription}
              boldStartIndex={result.boldStartIndex}
              boldEndIndex={result.boldEndIndex}
            />
          );
        })}
      </div>
    </Section>
  );
}

const toAcademicInfo = (
  academic: Academic,
): { path: string; itemLabel: TranslationKey; parentLabel: TranslationKey } => {
  if (academic.academicType === 'GUIDE') {
    return academic.studentType === 'UNDERGRADUATE'
      ? {
          path: '/academics/undergraduate/guide',
          itemLabel: '학부 안내',
          parentLabel: '학부',
        }
      : {
          path: '/academics/graduate/guide',
          itemLabel: '대학원 안내',
          parentLabel: '대학원',
        };
  }

  if (academic.postType === 'COURSE') {
    return academic.studentType === 'UNDERGRADUATE'
      ? {
          path: '/academics/undergraduate/courses',
          itemLabel: '교과과정',
          parentLabel: '학부',
        }
      : {
          path: '/academics/graduate/courses',
          itemLabel: '교과과정',
          parentLabel: '대학원',
        };
  }

  if (academic.academicType === 'COURSE_CHANGES') {
    return academic.studentType === 'UNDERGRADUATE'
      ? {
          path: '/academics/undergraduate/course-changes',
          itemLabel: '교과목 변경 내역',
          parentLabel: '학부',
        }
      : {
          path: '/academics/graduate/course-changes',
          itemLabel: '교과목 변경 내역',
          parentLabel: '대학원',
        };
  }

  if (academic.postType === 'SCHOLARSHIP') {
    return academic.studentType === 'UNDERGRADUATE'
      ? {
          path: '/academics/undergraduate/scholarship',
          itemLabel: '장학 제도',
          parentLabel: '학부',
        }
      : {
          path: '/academics/graduate/scholarship',
          itemLabel: '장학 제도',
          parentLabel: '대학원',
        };
  }

  if (academic.academicType === 'CURRICULUM') {
    return {
      path: '/academics/undergraduate/curriculum',
      itemLabel: '전공 이수 표준 형태',
      parentLabel: '학부',
    };
  }

  if (
    academic.academicType === 'GENERAL_STUDIES_REQUIREMENTS' ||
    academic.academicType === 'GENERAL_STUDIES_REQUIREMENTS_SUBJECT_CHANGES'
  ) {
    return {
      path: '/academics/undergraduate/general-studies-requirements',
      itemLabel: '필수 교양 과목',
      parentLabel: '학부',
    };
  }

  if (
    academic.academicType === 'DEGREE_REQUIREMENTS' ||
    academic.academicType === 'DEGREE_REQUIREMENTS_YEAR_LIST'
  ) {
    return {
      path: '/academics/undergraduate/degree-requirements',
      itemLabel: '졸업 규정',
      parentLabel: '학부',
    };
  }

  return {
    path: '/academics',
    itemLabel: '학사 및 교과',
    parentLabel: '학사 및 교과',
  };
};
