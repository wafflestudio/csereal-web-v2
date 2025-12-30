import { BASE_URL } from '~/constants/api';
import type {
  AboutSearchResult,
  AcademicsSearchResult,
  AdmissionsSearchResult,
  MemberSearchResult,
  NewsSearchResult,
  NoticeSearchResult,
  ResearchSearchResult,
} from '~/types/api/v2/search';
import type { SeminarPreviewList } from '~/types/api/v2/seminar';
import type { TreeNode } from './components/ui/SearchSubNavbar';

export type SectionContent = {
  about?: AboutSearchResult;
  notice?: NoticeSearchResult;
  news?: NewsSearchResult;
  seminar?: SeminarPreviewList;
  member?: MemberSearchResult;
  research?: ResearchSearchResult;
  admission?: AdmissionsSearchResult;
  academics?: AcademicsSearchResult;
};

export default async function fetchContent(
  keyword: string,
  tag?: string[],
  locale: string = 'ko',
) {
  const noTag = tag === undefined || tag.length === 0;
  const isSectionVisible = (sectionName: string) =>
    noTag || tag.includes(sectionName);

  const fetchSearch = async <T>(
    path: string,
    params: { keyword: string; number: number; amount?: number },
  ) => {
    const searchParams = new URLSearchParams({
      keyword: params.keyword,
      number: `${params.number}`,
      ...(params.amount ? { amount: `${params.amount}` } : {}),
    });

    const response = await fetch(
      `${BASE_URL}${path}?${searchParams.toString()}`,
    );
    if (!response.ok) throw new Error('Failed to fetch search data');
    return (await response.json()) as T;
  };

  const fetchSeminar = async (keywordValue: string, localeValue: string) => {
    const searchParams = new URLSearchParams({
      keyword: keywordValue,
      pageNum: '1',
      language: localeValue,
    });

    const response = await fetch(
      `${BASE_URL}/v2/seminar?${searchParams.toString()}`,
    );
    if (!response.ok) throw new Error('Failed to fetch seminar data');
    return (await response.json()) as SeminarPreviewList;
  };

  const [about, notice, news, seminar, member, research, admission, academics] =
    await Promise.all([
      isSectionVisible('소개')
        ? fetchSearch<AboutSearchResult>('/v2/about/search/top', {
            keyword,
            number: 3,
            amount: 200,
          })
        : undefined,
      isSectionVisible('소식')
        ? fetchSearch<NoticeSearchResult>('/v2/notice/totalSearch', {
            keyword,
            number: 3,
            amount: 200,
          })
        : undefined,
      isSectionVisible('소식')
        ? fetchSearch<NewsSearchResult>('/v2/news/totalSearch', {
            keyword,
            number: 3,
            amount: 200,
          })
        : undefined,
      isSectionVisible('소식') ? fetchSeminar(keyword, locale) : undefined,
      isSectionVisible('구성원')
        ? fetchSearch<MemberSearchResult>('/v2/member/search/top', {
            keyword,
            number: 10,
            amount: 200,
          })
        : undefined,
      isSectionVisible('연구·교육')
        ? fetchSearch<ResearchSearchResult>('/v2/research/search/top', {
            keyword,
            number: 3,
            amount: 200,
          })
        : undefined,
      isSectionVisible('입학')
        ? fetchSearch<AdmissionsSearchResult>('/v2/admissions/search/top', {
            keyword,
            number: 3,
            amount: 200,
          })
        : undefined,
      isSectionVisible('학사 및 교과')
        ? fetchSearch<AcademicsSearchResult>('/v2/academics/search/top', {
            keyword,
            number: 3,
            amount: 200,
          })
        : undefined,
    ]);

  const sectionContent: SectionContent = {
    about,
    notice,
    news,
    seminar,
    member,
    research,
    admission,
    academics,
  };

  const total = [
    about,
    notice,
    news,
    seminar,
    member,
    research,
    admission,
    academics,
  ].reduce((prev, cur) => prev + (cur?.total ?? 0), 0);

  const noticeTotal = notice?.total;
  const newsTotal = news?.total;
  const seminarTotal = seminar?.total;
  const hasCommunity = Boolean(notice || news || seminar);
  const communityTotal = hasCommunity
    ? (noticeTotal ?? 0) + (newsTotal ?? 0) + (seminarTotal ?? 0)
    : undefined;

  const node: TreeNode[] = [
    {
      id: 'all',
      name: '전체',
      size: noTag ? total : undefined,
      bold: noTag,
    },
    {
      id: 'about',
      name: '소개',
      size: about?.total,
      bold: !noTag && about !== undefined,
    },
    {
      id: 'community',
      name: '소식',
      size: communityTotal,
      children: [
        { id: 'notice', name: '공지사항', size: noticeTotal },
        { id: 'news', name: '새 소식', size: newsTotal },
        { id: 'seminar', name: '세미나', size: seminarTotal },
      ],
      bold: !noTag && hasCommunity,
    },
    {
      id: 'member',
      name: '구성원',
      size: member?.total,
      bold: !noTag && member !== undefined,
    },
    {
      id: 'research',
      name: '연구·교육',
      size: research?.total,
      bold: !noTag && research !== undefined,
    },
    {
      id: 'admissions',
      name: '입학',
      size: admission?.total,
      bold: !noTag && admission !== undefined,
    },
    {
      id: 'academics',
      name: '학사 및 교과',
      size: academics?.total,
      bold: !noTag && academics !== undefined,
    },
  ];

  return { sectionContent, node, total };
}
