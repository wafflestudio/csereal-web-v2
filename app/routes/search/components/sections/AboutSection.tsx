import { useLanguage } from '~/hooks/useLanguage';
import type { AboutPreview, AboutSearchResult } from '~/types/api/v2/search';
import BasicRow from '../ui/BasicRow';
import Section from '../ui/Section';

type TranslationKey = keyof typeof import('~/translations.json');

const ABOUT_PATHS: Record<AboutPreview['aboutPostType'], string> = {
  OVERVIEW: '/about/overview',
  GREETINGS: '/about/greetings',
  HISTORY: '/about/history',
  FUTURE_CAREERS: '/about/future-careers',
  STUDENT_CLUBS: '/about/student-clubs',
  FACILITIES: '/about/facilities',
  CONTACT: '/about/contact',
  DIRECTIONS: '/about/directions',
};

const ABOUT_LABELS: Record<AboutPreview['aboutPostType'], TranslationKey> = {
  OVERVIEW: '학부 소개',
  GREETINGS: '학부장 인사말',
  HISTORY: '연혁',
  FUTURE_CAREERS: '졸업생 진로',
  STUDENT_CLUBS: '동아리 소개',
  FACILITIES: '시설 안내',
  CONTACT: '연락처',
  DIRECTIONS: '찾아오는 길',
};

export default function AboutSection({ about }: { about: AboutSearchResult }) {
  const { t } = useLanguage();
  return (
    <Section title="소개" size={about.total} sectionId="about">
      <div className="flex flex-col gap-9">
        {about.results.map((result) => {
          const path = ABOUT_PATHS[result.aboutPostType];
          const itemLabel = ABOUT_LABELS[result.aboutPostType];
          const metaLabel = `${t('소개')} > ${t(itemLabel)}`;

          return (
            <BasicRow
              key={result.id}
              href={path}
              title={t(itemLabel)}
              metaLabel={metaLabel}
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
