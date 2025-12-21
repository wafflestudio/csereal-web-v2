import clsx from 'clsx';
import { Link } from 'react-router';
import Button from '~/components/common/Button';

type TagVariant = 'outline' | 'solid' | 'muted';
type TagSize = 'sm' | 'md';

interface TagProps {
  label: string;
  href?: string;
  onClick?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
  variant?: TagVariant;
  size?: TagSize;
}

const BASE_CLASS =
  'inline-flex items-center rounded-[1.875rem] border text-[13px] font-medium whitespace-nowrap transition duration-200';

const SIZE_CLASSES: Record<TagSize, string> = {
  sm: 'h-[26px] px-2.5',
  md: 'h-[30px] px-3 text-sm',
};

const VARIANT_CLASSES: Record<TagVariant, string> = {
  outline: 'bg-white border-main-orange text-main-orange',
  solid: 'bg-main-orange border-main-orange text-white',
  muted: 'bg-white border-neutral-400 text-neutral-400',
};

const HOVER_CLASSES: Record<TagVariant, string> = {
  outline: 'hover:bg-main-orange hover:border-main-orange hover:text-white',
  solid: 'hover:bg-[#e65817] hover:border-[#e65817]',
  muted: 'hover:border-neutral-500 hover:text-neutral-600',
};

export function Tag({
  label,
  href,
  onClick,
  onDelete,
  disabled = false,
  variant = 'outline',
  size = 'sm',
}: TagProps) {
  const isInteractive = Boolean(href || onClick);
  const className = clsx(
    BASE_CLASS,
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    isInteractive && !disabled && HOVER_CLASSES[variant],
    isInteractive && !disabled && 'cursor-pointer',
    disabled && 'opacity-60 cursor-not-allowed',
  );

  const content = (
    <>
      <span className={onDelete ? 'pr-1.5' : ''}>{label}</span>
      {onDelete && (
        <Button
          variant="text"
          tone="brand"
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          aria-label={`${label} 삭제`}
        >
          <span className="material-symbols-outlined text-sm align-middle">
            close
          </span>
        </Button>
      )}
    </>
  );

  if (href) {
    return (
      <Link to={href} className={className} aria-disabled={disabled}>
        {content}
      </Link>
    );
  }

  if (onClick && !onDelete) {
    return (
      <Button variant="pill" onClick={onClick} disabled={disabled}>
        {content}
      </Button>
    );
  }

  return <span className={className}>{content}</span>;
}
