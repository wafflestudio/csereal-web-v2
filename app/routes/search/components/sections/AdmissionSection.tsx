import { useLanguage } from '~/hooks/useLanguage';
import type { AdmissionsSearchResult } from '~/types/api/v2/search';
import BasicRow from '../ui/BasicRow';
import Section from '../ui/Section';

type TranslationKey = keyof typeof import('~/translations.json');

export default function AdmissionSection({
  admission,
}: {
  admission: AdmissionsSearchResult;
}) {
  const { t } = useLanguage();

  return (
    <Section title="입학" size={admission.total} sectionId="admissions">
      <div className="flex flex-col gap-7">
        {admission.admissions.map((result) => {
          const { path, itemLabel, parentLabel } = toAdmissionInfo(
            result.mainType,
            result.postType,
            '입학',
          );

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

const ADMISSIONS_INFO: Record<
  string,
  { path: string; itemLabel: TranslationKey; parentLabel: TranslationKey }
> = {
  'undergraduate:early-admission': {
    path: '/admissions/undergraduate/early-admission',
    itemLabel: '수시 모집',
    parentLabel: '학부',
  },
  'undergraduate:regular-admission': {
    path: '/admissions/undergraduate/regular-admission',
    itemLabel: '정시 모집',
    parentLabel: '학부',
  },
  'graduate:regular-admission': {
    path: '/admissions/graduate/regular-admission',
    itemLabel: '전기/후기 모집',
    parentLabel: '대학원',
  },
  'international:undergraduate': {
    path: '/admissions/international/undergraduate',
    itemLabel: 'Undergraduate',
    parentLabel: 'International',
  },
  'international:graduate': {
    path: '/admissions/international/graduate',
    itemLabel: 'Graduate',
    parentLabel: 'International',
  },
  'international:exchange-visiting': {
    path: '/admissions/international/exchange',
    itemLabel: 'Exchange/Visiting Program',
    parentLabel: 'International',
  },
  'international:exchange': {
    path: '/admissions/international/exchange',
    itemLabel: 'Exchange/Visiting Program',
    parentLabel: 'International',
  },
  'international:scholarships': {
    path: '/admissions/international/scholarships',
    itemLabel: 'Scholarships',
    parentLabel: 'International',
  },
};

const toAdmissionInfo = (
  mainType: string,
  postType: string,
  fallbackLabel: TranslationKey,
) => {
  const normalize = (value: string) => value.toLowerCase().replaceAll('_', '-');
  const key = `${normalize(mainType)}:${normalize(postType)}`;

  return (
    ADMISSIONS_INFO[key] ?? {
      path: `/admissions/${key.replace(':', '/')}`,
      itemLabel: fallbackLabel,
      parentLabel: '입학',
    }
  );
};
