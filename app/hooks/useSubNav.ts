import { useLanguage } from '~/hooks/useLanguage';

export interface SubNavConfig {
  title: string;
  titlePath: string;
  items: SubNavConfigItem[];
}

export interface SubNavConfigItem {
  name: string;
  path?: string;
  depth?: 0 | 1 | 2;
}

export const useAboutSubNav = (): SubNavConfig => {
  const { t } = useLanguage();

  return {
    title: t('소개'),
    titlePath: '/about/overview',
    items: [
      { name: t('학부 소개'), path: '/about/overview', depth: 1 },
      { name: t('학부장 인사말'), path: '/about/greetings', depth: 1 },
      { name: t('연혁'), path: '/about/history', depth: 1 },
      { name: t('졸업생 진로'), path: '/about/future-careers', depth: 1 },
      { name: t('동아리 소개'), path: '/about/student-clubs', depth: 1 },
      { name: t('시설 안내'), path: '/about/facilities', depth: 1 },
      { name: t('연락처'), path: '/about/contact', depth: 1 },
      { name: t('찾아오는 길'), path: '/about/directions', depth: 1 },
    ],
  };
};

export const useAdmissionsSubNav = (): SubNavConfig => {
  const { t } = useLanguage();

  return {
    title: t('입학'),
    titlePath: '/admissions',
    items: [
      {
        name: t('학부'),
        depth: 1,
      },
      {
        name: t('수시 모집'),
        path: '/admissions/undergraduate/early-admission',
        depth: 2,
      },
      {
        name: t('정시 모집'),
        path: '/admissions/undergraduate/regular-admission',
        depth: 2,
      },
      {
        name: t('대학원'),
        depth: 1,
      },
      {
        name: t('전기/후기 모집'),
        path: '/admissions/graduate/regular-admission',
        depth: 2,
      },
      {
        name: t('International'),
        depth: 1,
      },
      {
        name: t('Undergraduate'),
        path: '/admissions/international/undergraduate',
        depth: 2,
      },
      {
        name: t('Graduate'),
        path: '/admissions/international/graduate',
        depth: 2,
      },
      {
        name: t('Exchange/Visiting Program'),
        path: '/admissions/international/exchange',
        depth: 2,
      },
      {
        name: t('Scholarships'),
        path: '/admissions/international/scholarships',
        depth: 2,
      },
    ],
  };
};

export const useCommunitySubNav = (): SubNavConfig => {
  const { t } = useLanguage();

  return {
    title: t('소식'),
    titlePath: '/community',
    items: [
      { name: t('공지사항'), path: '/community/notice', depth: 1 },
      { name: t('새 소식'), path: '/community/news', depth: 1 },
      { name: t('세미나'), path: '/community/seminar', depth: 1 },
      {
        name: t('신임교수초빙'),
        path: '/community/faculty-recruitment',
        depth: 1,
      },
    ],
  };
};

export const usePeopleSubNav = (): SubNavConfig => {
  const { t } = useLanguage();

  return {
    title: t('구성원'),
    titlePath: '/people',
    items: [
      { name: t('교수진'), path: '/people/faculty', depth: 1 },
      { name: t('역대 교수진'), path: '/people/emeritus-faculty', depth: 1 },
      { name: t('행정직원'), path: '/people/staff', depth: 1 },
    ],
  };
};

export const useResearchSubNav = (): SubNavConfig => {
  const { t } = useLanguage();

  return {
    title: t('연구·교육'),
    titlePath: '/research',
    items: [
      { name: t('연구·교육 스트림'), path: '/research/groups', depth: 1 },
      { name: t('연구 센터'), path: '/research/centers', depth: 1 },
      { name: t('연구실 목록'), path: '/research/labs', depth: 1 },
      {
        name: t('Top Conference List'),
        path: '/research/top-conference-list',
        depth: 1,
      },
    ],
  };
};

export const useReservationsSubNav = (): SubNavConfig => {
  const { tUnsafe } = useLanguage();

  return {
    title: tUnsafe('시설 예약'),
    titlePath: '/reservations',
    items: [
      {
        name: tUnsafe('시설 예약 안내'),
        path: '/reservations/introduction',
        depth: 1,
      },
      { name: tUnsafe('세미나실 예약'), depth: 1 },
      {
        name: tUnsafe('301-417 (20석)'),
        path: '/reservations/seminar-room/301-417',
        depth: 2,
      },
      {
        name: tUnsafe('301-MALDIVES (301-521, 11석)'),
        path: '/reservations/seminar-room/301-521',
        depth: 2,
      },
      {
        name: tUnsafe('301-HAWAII (301-551-4, 20석)'),
        path: '/reservations/seminar-room/301-551-4',
        depth: 2,
      },
      {
        name: tUnsafe('301-BAEKDU (301-552-1, 4석)'),
        path: '/reservations/seminar-room/301-552-1',
        depth: 2,
      },
      {
        name: tUnsafe('301-ALPS (301-552-2, 5석)'),
        path: '/reservations/seminar-room/301-552-2',
        depth: 2,
      },
      {
        name: tUnsafe('301-SANTORINI (301-552-3, 4석)'),
        path: '/reservations/seminar-room/301-552-3',
        depth: 2,
      },
      {
        name: tUnsafe('301-JEJU (301-553-6, 6석)'),
        path: '/reservations/seminar-room/301-553-6',
        depth: 2,
      },
      {
        name: tUnsafe('301-교수회의실 (301-317, 20석)'),
        path: '/reservations/seminar-room/301-317',
        depth: 2,
      },
      {
        name: tUnsafe('302-308 (46석)'),
        path: '/reservations/seminar-room/302-308',
        depth: 2,
      },
      {
        name: tUnsafe('302-309-1 (48석)'),
        path: '/reservations/seminar-room/302-309-1',
        depth: 2,
      },
      {
        name: tUnsafe('302-309-2 (8석)'),
        path: '/reservations/seminar-room/302-309-2',
        depth: 2,
      },
      {
        name: tUnsafe('302-309-3 (8석)'),
        path: '/reservations/seminar-room/302-309-3',
        depth: 2,
      },
      { name: tUnsafe('실습실 예약'), depth: 1 },
      {
        name: tUnsafe('소프트웨어 실습실 (302-311-1, 102석)'),
        path: '/reservations/lab/302-311-1',
        depth: 2,
      },
      {
        name: tUnsafe('하드웨어 실습실 (302-310-2, 30석)'),
        path: '/reservations/lab/302-310-2',
        depth: 2,
      },
      { name: tUnsafe('공과대학 강의실 예약'), depth: 1 },
      {
        name: tUnsafe('302-208 (116석)'),
        path: '/reservations/lecture-room/302-208',
        depth: 2,
      },
      {
        name: tUnsafe('302-209 (90석)'),
        path: '/reservations/lecture-room/302-209',
        depth: 2,
      },
    ],
  };
};

export const useAcademicsSubNav = (): SubNavConfig => {
  const { t } = useLanguage();

  return {
    title: t('학사 및 교과'),
    titlePath: '/academics',
    items: [
      { name: t('학부'), depth: 1 },
      {
        name: t('학부 안내'),
        path: '/academics/undergraduate/guide',
        depth: 2,
      },
      {
        name: t('교과과정'),
        path: '/academics/undergraduate/courses',
        depth: 2,
      },
      {
        name: t('전공 이수 표준 형태'),
        path: '/academics/undergraduate/curriculum',
        depth: 2,
      },
      {
        name: t('필수 교양 과목'),
        path: '/academics/undergraduate/general-studies-requirements',
        depth: 2,
      },
      {
        name: t('졸업 규정'),
        path: '/academics/undergraduate/degree-requirements',
        depth: 2,
      },
      {
        name: t('교과목 변경 내역'),
        path: '/academics/undergraduate/course-changes',
        depth: 2,
      },
      {
        name: t('장학 제도'),
        path: '/academics/undergraduate/scholarship',
        depth: 2,
      },
      { name: t('대학원'), depth: 1 },
      { name: t('대학원 안내'), path: '/academics/graduate/guide', depth: 2 },
      { name: t('교과과정'), path: '/academics/graduate/courses', depth: 2 },
      {
        name: t('교과목 변경 내역'),
        path: '/academics/graduate/course-changes',
        depth: 2,
      },
      {
        name: t('장학 제도'),
        path: '/academics/graduate/scholarship',
        depth: 2,
      },
    ],
  };
};
