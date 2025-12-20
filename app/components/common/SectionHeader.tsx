import clsx from 'clsx';
import { Link } from 'react-router';

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
          {action.icon === 'plus' ? <Plus /> : <SmallRightArrow />}
        </Link>
      )}
    </div>
  );
}

const SmallRightArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
  >
    <path
      d="M9.003 3.60039L14.3984 8.99583M14.3984 8.99583L9.003 14.4004M14.3984 8.99583L3.59844 8.99583"
      stroke="#E65615"
      strokeWidth="1.3"
    />
  </svg>
);

const Plus = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M9 15.5999V10.5999H4V9.3999H9V4.3999H10.2V9.3999H15.2V10.5999H10.2V15.5999H9Z"
      fill="#E65817"
    />
  </svg>
);
