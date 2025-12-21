import { useLanguage } from '~/hooks/useLanguage';

export const useAboutSubNav = () => {
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

export const useAdmissionsSubNav = () => {
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

export const useCommunitySubNav = () => {
  const { t, tUnsafe } = useLanguage();

  return {
    title: tUnsafe('커뮤니티'),
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
