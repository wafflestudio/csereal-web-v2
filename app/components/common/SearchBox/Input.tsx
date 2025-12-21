import { useLanguage } from '~/hooks/useLanguage';

interface KeywordInputProps {
  defaultValue: string;
  disabled?: boolean;
}

export default function Input({
  defaultValue,
  disabled = false,
}: KeywordInputProps) {
  const { t } = useLanguage({ 검색: 'Search' });

  return (
    <div className="flex items-center">
      <h5 className="mr-7 whitespace-nowrap text-md font-bold tracking-wide">
        {t('검색')}
      </h5>
      <div className="relative flex h-7.5 w-54 items-center justify-between rounded-sm bg-white pr-3">
        <input
          type="text"
          id="search"
          name="keyword"
          className="autofill-bg-white w-full rounded-sm bg-transparent px-2 text-sm tracking-wide outline-none"
          defaultValue={defaultValue}
          disabled={disabled}
        />
        <button
          type="submit"
          className="material-symbols-rounded text-[1.25rem] font-light text-neutral-800 hover:text-neutral-500"
        >
          search
        </button>
      </div>
    </div>
  );
}
