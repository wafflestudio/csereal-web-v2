import clsx from 'clsx';
import { Link } from 'react-router';
import PlusIcon from './assets/plus.svg?react';
import SmallRightArrowIcon from './assets/small_right_arrow.svg?react';

interface ActionConfig {
  label: string;
  to: string;
  icon?: 'arrow' | 'plus';
}

interface SectionHeaderProps {
  title: string;
  size?: 'md' | 'lg';
  action?: ActionConfig;
  actionVisibility?: 'always' | 'desktop';
}

const TITLE_CLASSES: Record<'md' | 'lg', string> = {
  md: 'text-[1.25rem] font-semibold text-neutral-950 sm:text-[1.75rem] sm:font-medium',
  lg: 'text-[1.75rem] font-semibold text-neutral-950',
};

const ACTION_CLASSES =
  'items-center gap-1 text-base font-normal text-[#E65615]';

export default function SectionHeader({
  title,
  size = 'md',
  action,
  actionVisibility = 'always',
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className={TITLE_CLASSES[size]}>{title}</h3>
      {action && (
        <Link
          className={clsx(
            'flex',
            ACTION_CLASSES,
            actionVisibility === 'desktop' && 'hidden sm:flex',
          )}
          to={action.to}
        >
          {action.label}{' '}
          {action.icon === 'plus' ? <PlusIcon /> : <SmallRightArrowIcon />}
        </Link>
      )}
    </div>
  );
}
