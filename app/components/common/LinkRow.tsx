import clsx from 'clsx';
import { Link } from 'react-router';

interface LinkRowProps {
  to: string;
  title: string;
  subtitle?: string;
  tone?: 'brand' | 'neutral';
  size?: 'sm' | 'md';
}

const ROOT_CLASSES: Record<'sm' | 'md', string> = {
  sm: 'h-9',
  md: 'h-10',
};

export default function LinkRow({
  to,
  title,
  subtitle,
  tone = 'brand',
  size = 'md',
}: LinkRowProps) {
  const borderColor =
    tone === 'brand' ? 'border-[#E65817]' : 'border-neutral-300';
  const textColor = tone === 'brand' ? 'text-white' : 'text-neutral-900';
  const hoverText =
    tone === 'brand'
      ? 'group-hover:text-main-orange'
      : 'group-hover:text-neutral-700';
  const arrowColor = tone === 'brand' ? 'text-white' : 'text-neutral-900';

  return (
    <Link
      to={to}
      className={clsx(
        'group flex items-center justify-between border-l-[5px] pl-7 duration-300',
        ROOT_CLASSES[size],
        borderColor,
      )}
    >
      <div className={clsx('flex items-end gap-3', textColor, hoverText)}>
        <p className="text-base font-medium sm:text-lg sm:font-semibold">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs font-medium sm:font-semibold">{subtitle}</p>
        )}
      </div>
      <span
        className={clsx(
          'material-symbols-outlined pt-0.5 text-[30px] font-extralight duration-300 group-hover:translate-x-[10px] group-hover:font-light',
          arrowColor,
          tone === 'brand' && 'group-hover:text-main-orange',
        )}
      >
        arrow_forward
      </span>
    </Link>
  );
}
