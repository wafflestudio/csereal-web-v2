import Button from '~/components/common/Button';
import LoginVisible from '~/components/common/LoginVisible';
import HeaderSearchBar from '~/components/layout/Header/HeaderSearchBar';
import { useLanguage } from '~/hooks/useLanguage';
import { useStore } from '~/store';

const translations = {
  '관리자 메뉴': 'Admin Menu',
  로그인: 'Log in',
  로그아웃: 'Log out',
};

function Divider() {
  return <div className="h-3 w-[0.03125rem] bg-white" />;
}

export default function HeaderRight() {
  const role = useStore((s) => s.role);
  const login = useStore((s) => s.login);
  const logout = useStore((s) => s.logout);

  const { isEnglish, changeLanguage, t } = useLanguage(translations);

  return (
    <div className="hidden flex-col items-end justify-between gap-[0.94rem] sm:flex">
      <div className="flex items-center gap-3 text-sm font-normal text-white">
        {/* Admin menu - only for ROLE_STAFF */}
        <LoginVisible allow="ROLE_STAFF">
          <Button variant="text" tone="inverse" size="sm" as="link" to="/admin">
            {t('관리자 메뉴')}
          </Button>
          <Divider />
        </LoginVisible>

        {/* Login/Logout button */}
        {role ? (
          <Button variant="text" tone="inverse" size="sm" onClick={logout}>
            {t('로그아웃')}
          </Button>
        ) : (
          <Button variant="text" tone="inverse" size="sm" onClick={login}>
            {t('로그인')}
          </Button>
        )}

        <Divider />

        {/* Language toggle */}
        <Button
          variant="text"
          tone="inverse"
          size="sm"
          onClick={changeLanguage}
        >
          {isEnglish ? '한국어' : 'ENG'}
        </Button>
      </div>

      {/* Search bar */}
      <HeaderSearchBar />
    </div>
  );
}
