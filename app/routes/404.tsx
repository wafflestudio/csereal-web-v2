import { useLocation, useNavigate } from 'react-router';
import ErrorState from '~/components/common/ErrorState';
import Header from '~/components/layout/Header';
import { useLanguage } from '~/hooks/useLanguage';

export default function NotFound() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage({
    '존재하지 않는 경로입니다': 'Page not found',
    '메인으로 이동': 'Go to home',
  });

  return (
    <>
      <Header />
      <ErrorState
        message={`${t('존재하지 않는 경로입니다')}: ${pathname}`}
        action={{ label: t('메인으로 이동'), onClick: () => navigate('/') }}
      />
    </>
  );
}
