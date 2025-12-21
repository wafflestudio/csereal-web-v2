import clsx from 'clsx';
import { useNavigate, useSearchParams } from 'react-router';
import useResponsive from '~/hooks/useResponsive';

interface PaginationProps {
  page: number;
  totalPages: number;
  disabled?: boolean;
}

const DESKTOP_PAGE_COUNT = 10;
const MOBILE_PAGE_COUNT = 5;

export default function Pagination({
  page,
  totalPages,
  disabled = false,
}: PaginationProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useResponsive();
  const pageLimit = isMobile ? MOBILE_PAGE_COUNT : DESKTOP_PAGE_COUNT;
  const safeTotalPages = Math.max(1, totalPages);
  const firstNum = page - ((page - 1) % pageLimit);
  const count = Math.max(1, Math.min(pageLimit, safeTotalPages - firstNum + 1));

  const handleChange = (nextPage: number) => {
    if (disabled || nextPage === page) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('pageNum', nextPage.toString());
    navigate({ search: newParams.toString() });
  };

  return (
    <div className={clsx('flex justify-center', disabled && 'opacity-30')}>
      <ul className="mx-auto flex h-6 gap-x-2 tracking-wide text-neutral-800">
        <PaginationArrow
          iconName="keyboard_double_arrow_left"
          disabled={page === 1 || disabled}
          onClick={() => handleChange(1)}
        />
        <PaginationArrow
          iconName="navigate_before"
          disabled={firstNum === 1 || disabled}
          onClick={() => handleChange(Math.max(1, firstNum - 1))}
        />
        <div className="flex gap-x-2 px-2">
          {Array(count)
            .fill(firstNum)
            .map((num, i) => (
              <PaginationNumber
                key={num + i}
                num={num + i}
                isSelected={page === num + i}
                disabled={disabled}
                onClick={() => handleChange(num + i)}
              />
            ))}
        </div>
        <PaginationArrow
          iconName="navigate_next"
          disabled={firstNum + pageLimit > safeTotalPages || disabled}
          onClick={() =>
            handleChange(Math.min(safeTotalPages, firstNum + pageLimit))
          }
        />
        <PaginationArrow
          iconName="keyboard_double_arrow_right"
          disabled={page === safeTotalPages || disabled}
          onClick={() => handleChange(safeTotalPages)}
        />
      </ul>
    </div>
  );
}

interface PaginationArrowProps {
  iconName: string;
  disabled: boolean;
  onClick: () => void;
}

function PaginationArrow({
  iconName,
  disabled,
  onClick,
}: PaginationArrowProps) {
  return disabled ? (
    <span className="material-symbols-rounded pointer-events-none cursor-default text-2xl font-light text-neutral-400">
      {iconName}
    </span>
  ) : (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer hover:text-main-orange"
      aria-label={iconName}
    >
      <span className="material-symbols-rounded text-2xl font-light">
        {iconName}
      </span>
    </button>
  );
}

interface PaginationNumberProps {
  num: number;
  isSelected: boolean;
  disabled: boolean;
  onClick: () => void;
}

function PaginationNumber({
  num,
  isSelected,
  disabled,
  onClick,
}: PaginationNumberProps) {
  const cursorStyle =
    isSelected || disabled
      ? 'cursor-default pointer-events-none'
      : 'cursor-pointer';
  const textStyle = isSelected
    ? 'text-main-orange'
    : disabled
      ? ''
      : 'hover:text-main-orange';

  return (
    <button
      type="button"
      className={clsx(
        'flex items-center justify-center px-2',
        cursorStyle,
        textStyle,
      )}
      onClick={onClick}
      aria-current={isSelected ? 'page' : undefined}
    >
      <span className={clsx('text-md', isSelected && 'font-bold underline')}>
        {num}
      </span>
    </button>
  );
}
