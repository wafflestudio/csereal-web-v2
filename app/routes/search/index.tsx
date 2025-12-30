import type { Route } from '.react-router/types/app/routes/search/+types/index';
import SearchBox from '~/components/feature/SearchBox';
import PageLayout from '~/components/layout/PageLayout';
import { useLanguage } from '~/hooks/useLanguage';
import { getLocaleFromPathname } from '~/utils/string';
import MagnificentGlass from './assets/magnificent_glass.svg?react';
import AboutSection from './components/sections/AboutSection';
import AcademicSection from './components/sections/AcademicSection';
import AdmissionSection from './components/sections/AdmissionSection';
import CommunitySection from './components/sections/CommunitySection';
import MemberSection from './components/sections/MemberSection';
import ResearchSection from './components/sections/ResearchSection';
import NoSearchResult from './components/ui/NoSearchResult';
import SearchSubNavbar, {
  type TreeNode,
} from './components/ui/SearchSubNavbar';
import fetchContent, { type SectionContent } from './fetchContent';

const SEARCH_TAGS = [
  '소개',
  '소식',
  '구성원',
  '연구·교육',
  '입학',
  '학사 및 교과',
];

type SearchLoaderData = {
  keyword?: string;
  tag: string[];
  total?: number;
  sectionContent?: SectionContent;
  node?: TreeNode[];
  tooShort?: boolean;
};

export async function loader({
  request,
}: Route.LoaderArgs): Promise<SearchLoaderData> {
  const url = new URL(request.url);
  const keyword = url.searchParams.get('keyword') ?? undefined;
  const tag = url.searchParams.getAll('tag');
  const locale = getLocaleFromPathname(url.pathname);

  if (!keyword) return { keyword, tag };

  if (keyword.length < 2) {
    return { keyword, tag, tooShort: true };
  }

  const { sectionContent, node, total } = await fetchContent(
    keyword,
    tag,
    locale,
  );

  return { keyword, tag, total, sectionContent, node };
}

export default function SearchPage({ loaderData }: Route.ComponentProps) {
  const { t, locale } = useLanguage();

  const { keyword, sectionContent, total, node, tooShort } = loaderData;

  return (
    <PageLayout title={t('통합 검색')} titleSize="xl" titleMargin="mb-11">
      <SearchBox tags={SEARCH_TAGS} formOnly />

      {tooShort && (
        <div className="flex flex-col items-center">
          <p className="text-base font-medium text-neutral-300">
            {t('검색어를 두글자 이상 입력해주세요')}
          </p>
          <MagnificentGlass />
        </div>
      )}

      {!tooShort && keyword && total === 0 && <NoSearchResult />}

      {!tooShort &&
        keyword &&
        total !== undefined &&
        total > 0 &&
        sectionContent && (
          <>
            <p className="mb-11 ml-3 text-md text-neutral-500 sm:mb-14">
              {locale === 'en' ? `${total} results` : `${total}개의 검색결과`}
            </p>
            <div className="flex grow flex-col gap-20">
              {sectionContent.about && (
                <AboutSection about={sectionContent.about} />
              )}
              {sectionContent.notice &&
                sectionContent.news &&
                sectionContent.seminar && (
                  <CommunitySection
                    keyword={keyword}
                    notice={sectionContent.notice}
                    news={sectionContent.news}
                    seminar={sectionContent.seminar}
                  />
                )}
              {sectionContent.member && (
                <MemberSection member={sectionContent.member} />
              )}
              {sectionContent.research && (
                <ResearchSection research={sectionContent.research} />
              )}
              {sectionContent.admission && (
                <AdmissionSection admission={sectionContent.admission} />
              )}
              {sectionContent.academics && (
                <AcademicSection academic={sectionContent.academics} />
              )}
            </div>
          </>
        )}

      {node && <SearchSubNavbar node={node} />}
    </PageLayout>
  );
}
