import { useLanguage } from '~/hooks/useLanguage';
import type { ResearchSearchResult, ResearchType } from '~/types/api/v2/search';
import BasicRow from '../ui/BasicRow';
import Section from '../ui/Section';

type TranslationKey = keyof typeof import('~/translations.json');

export default function ResearchSection({
  research,
}: {
  research: ResearchSearchResult;
}) {
  const { t } = useLanguage();

  return (
    <Section title="연구·교육" size={research.total} sectionId="research">
      <div className="flex flex-col gap-7">
        {research.results.map((result) => {
          const href = toResearchUrl(
            result.researchType,
            result.id,
            result.name,
          );
          const basePath = toResearchBasePath(result.researchType);
          const itemLabel = toResearchLabel(result.researchType);
          const metaLabel = `${t('연구·교육')} > ${t(itemLabel)}`;

          return (
            <BasicRow
              key={result.id}
              href={href}
              title={result.name}
              metaLabel={metaLabel}
              metaHref={basePath}
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

const toResearchLabel = (researchType: ResearchType): TranslationKey => {
  switch (researchType) {
    case 'CONFERENCE':
      return 'Top Conference List';
    case 'LAB':
      return '연구실 목록';
    case 'RESEARCH_CENTER':
      return '연구 센터';
    case 'RESEARCH_GROUP':
      return '연구·교육 스트림';
  }
};

const toResearchBasePath = (researchType: ResearchType) => {
  switch (researchType) {
    case 'CONFERENCE':
      return '/research/top-conference-list';
    case 'LAB':
      return '/research/labs';
    case 'RESEARCH_CENTER':
      return '/research/centers';
    case 'RESEARCH_GROUP':
      return '/research/groups';
  }
};

const toResearchUrl = (
  researchType: ResearchType,
  id: number,
  name: string,
) => {
  switch (researchType) {
    case 'CONFERENCE':
      return '/research/top-conference-list';
    case 'LAB':
      return `/research/labs/${id}`;
    case 'RESEARCH_CENTER':
      return `/research/centers?selected=${encodeURIComponent(name)}`;
    case 'RESEARCH_GROUP':
      return `/research/groups?selected=${encodeURIComponent(name)}`;
  }
};
