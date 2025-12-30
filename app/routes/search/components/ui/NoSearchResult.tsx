import { useLanguage } from '~/hooks/useLanguage';
import MagnificentGlass from '../../assets/magnificent_glass.svg?react';

export default function NoSearchResult() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center">
      <p className="text-base font-medium text-neutral-300">
        {t('검색 결과가 존재하지 않습니다')}
      </p>
      <MagnificentGlass />
    </div>
  );
}
