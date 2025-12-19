import type { Locale } from '~/types/i18n';
import type footerTranslations from './translations.json';

type TranslationKeys = keyof typeof footerTranslations;

type Links = { href: string; title: TranslationKeys }[];

export type LinkGroupProps = {
  groupName: string;
  links: Links;
  width: string;
};

const aboutLinks = [
  { href: '/about/overview', title: '학부 소개' },
  { href: '/people/faculty', title: '교수진' },
  { href: '/academics/undergraduate/guide', title: '학부 안내' },
  { href: '/academics/graduate/guide', title: '대학원 안내' },
] satisfies Links;

const resourcesLinks = [
  { href: '/community/notice', title: '공지사항' },
  { href: '/community/seminar', title: '세미나' },
  { href: '/reservations/introduction', title: '시설 예약 안내' },
] satisfies Links;

const researchLinks = [
  { href: '/community/faculty-recruitment', title: '신임교수초빙' },
  { href: '/research/labs', title: '연구실 목록' },
  { href: '/research/top-conference-list', title: 'Top Conference List' },
  { href: '/research/ten-ten-project', title: '10-10 Project' },
] satisfies Links;

const moreLinks = [
  { title: '연합전공 인공지능(학사)', href: 'https://imai.snu.ac.kr' },
  { title: '지능형컴퓨팅사업단', href: 'http://bkcse.snu.ac.kr' },
  { title: '컴퓨터 연구소', href: 'http://ict.snu.ac.kr' },
  { title: '해동학술정보실', href: 'http://haedong.snu.ac.kr/' },
] satisfies Links;

export const getLinkGroups = (locale: Locale) =>
  [
    {
      groupName: 'About',
      links: aboutLinks,
      width: locale === 'ko' ? 'w-[7.5rem]' : 'w-[10rem]',
    },
    {
      groupName: 'Resources',
      links: resourcesLinks,
      width: 'w-[8.25rem]',
    },
    {
      groupName: 'Research',
      links: researchLinks,
      width: 'w-[9rem]',
    },
    {
      groupName: 'More',
      links: moreLinks,
      width: 'w-[8rem]',
    },
  ] satisfies LinkGroupProps[];
