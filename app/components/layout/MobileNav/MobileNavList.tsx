import { useState } from 'react';
import { useNavigate } from 'react-router';
import Button from '~/components/common/Button';
import type { NavItem } from '~/constants/navigation';
import { navigationTree } from '~/constants/navigation';
import { useLanguage } from '~/hooks/useLanguage';
import { useStore } from '~/store';
import navbarTranslations from '../LeftNav/translations.json';
import SearchIcon from './assets/search.svg?react';

export default function MobileNavList() {
  const navbarState = useStore((s) => s.navbarState);
  const hoverNavItem = useStore((s) => s.hoverNavItem);
  const { tUnsafe } = useLanguage(navbarTranslations);
  const [search, setSearch] = useState(false);

  const shouldHighlight = (item: NavItem) => {
    if (navbarState.type === 'hovered') {
      return item.key === navbarState.navItem.key;
    }
    return false;
  };

  return (
    <nav className="flex min-w-[100px] grow-[6.25] basis-0 flex-col justify-between bg-[#323235] pt-10">
      <ul className="flex flex-col gap-9 text-center">
        {navigationTree.map((item, i) => (
          <li
            key={i}
            className={`text-sm font-medium ${
              shouldHighlight(item) ? 'text-white' : 'text-neutral-500'
            } cursor-pointer whitespace-nowrap leading-5`}
            onClick={() => hoverNavItem(item)}
            onKeyDown={(e) => e.key === 'Enter' && hoverNavItem(item)}
          >
            {tUnsafe(item.key)}
          </li>
        ))}
      </ul>

      <div className="mb-[40px] flex flex-col items-center text-sm font-medium text-neutral-500">
        <Button
          variant="text"
          tone="muted"
          size="sm"
          onClick={() => setSearch(true)}
          ariaLabel="검색"
          iconLeft={<SearchIcon />}
        />
        <AuthButton />
        <LangButton />
      </div>

      {search && <SearchPage onClose={() => setSearch(false)} />}
    </nav>
  );
}

// SearchPage 컴포넌트
function SearchPage({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { localizedPath } = useLanguage();
  const [text, setText] = useState('');

  const search = () => {
    if (text.trim()) {
      navigate(`${localizedPath('/search')}?keyword=${text}`);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 z-50 bg-[#1F2021]">
      <div className="mx-[1.94rem] mt-9 flex items-center border-b border-neutral-400">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          className="h-8 w-full bg-transparent text-md text-white outline-none placeholder:text-neutral-500"
          placeholder="검색어를 입력해주세요"
          // biome-ignore lint/a11y/noAutofocus: 넣을거임
          autoFocus
        />
        <Button
          variant="text"
          tone="muted"
          size="sm"
          onClick={search}
          ariaLabel="검색 실행"
          iconLeft={<SearchIcon />}
        />
      </div>
    </div>
  );
}

// AuthButton 컴포넌트
function AuthButton() {
  const login = useStore((s) => s.login);
  const logout = useStore((s) => s.logout);
  const role = useStore((s) => s.role);

  const isLoggedIn = role !== undefined;

  return (
    <div className="mt-6">
      <Button
        variant="text"
        tone="muted"
        size="sm"
        onClick={isLoggedIn ? logout : login}
      >
        {isLoggedIn ? 'LOGOUT' : 'LOGIN'}
      </Button>
    </div>
  );
}

// LangButton 컴포넌트
function LangButton() {
  const { locale, changeLanguage } = useLanguage();

  return (
    <div className="mt-[0.62rem]">
      <Button variant="text" tone="muted" size="sm" onClick={changeLanguage}>
        {locale === 'ko' ? 'ENG' : '한국어'}
      </Button>
    </div>
  );
}

// SearchIcon 컴포넌트
