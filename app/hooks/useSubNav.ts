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
