import clsx from 'clsx';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';
import { forwardRef } from 'react';
import { Link } from 'react-router';

type ButtonTone = 'brand' | 'neutral' | 'inverse' | 'muted' | 'inherit';
type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'text' | 'pill';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

type BaseProps = {
  variant: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  fullWidth?: boolean;
  selected?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  ariaLabel?: string;
  children?: ReactNode;
};

type ButtonAsButton = BaseProps & {
  as?: 'button';
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  disabled?: boolean;
};

type ButtonAsLink = BaseProps & {
  as: 'link';
  to: string;
};

type ButtonAsAnchor = BaseProps & {
  as: 'a';
  href: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>['rel'];
};

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

const SIZE_CLASSES: Record<ButtonSize, string> = {
  xs: 'text-xs sm:text-md px-0 py-0',
  sm: 'text-sm px-2.5 py-1',
  md: 'text-md px-[.875rem] py-[.3125rem] leading-6',
  lg: 'text-lg px-4 py-2',
};

const TEXT_SIZE_CLASSES: Record<ButtonSize, string> = {
  xs: 'text-xs sm:text-md font-normal tracking-[.02em]',
  sm: 'text-sm font-normal',
  md: 'text-md font-normal',
  lg: 'text-lg font-normal',
};

const VARIANT_CLASSES: Record<ButtonVariant, Record<ButtonTone, string>> = {
  solid: {
    brand: 'rounded-[.0625rem] bg-main-orange text-neutral-900',
    neutral: 'rounded-[.0625rem] bg-neutral-200 text-neutral-700',
    inverse: 'rounded-[.0625rem] bg-neutral-900 text-white',
    muted: 'rounded-[.0625rem] bg-neutral-600 text-white',
    inherit: 'rounded-[.0625rem] bg-neutral-200 text-inherit',
  },
  outline: {
    brand:
      'rounded-[.0625rem] border border-main-orange text-main-orange hover:bg-main-orange/10',
    neutral:
      'rounded-[.0625rem] border border-neutral-200 bg-neutral-100 text-neutral-500 hover:bg-neutral-200',
    inverse:
      'rounded-[.0625rem] border border-neutral-200 text-white hover:bg-neutral-800',
    muted:
      'rounded-[.0625rem] border border-neutral-500 text-neutral-500 hover:text-white hover:bg-neutral-700',
    inherit: 'rounded-[.0625rem] border border-neutral-300 text-inherit',
  },
  ghost: {
    brand: 'rounded-[.0625rem] text-main-orange hover:bg-main-orange/10',
    neutral: 'rounded-[.0625rem] text-neutral-700 hover:bg-neutral-100',
    inverse: 'rounded-[.0625rem] text-white hover:bg-neutral-800',
    muted: 'rounded-[.0625rem] text-neutral-500 hover:text-white',
    inherit: 'rounded-[.0625rem] text-inherit hover:text-main-orange',
  },
  text: {
    brand: 'text-main-orange hover:text-main-orange/80',
    neutral: 'text-neutral-700 hover:text-neutral-900',
    inverse: 'text-white hover:text-neutral-200',
    muted: 'text-neutral-500 hover:text-white',
    inherit: 'text-inherit hover:text-main-orange',
  },
  pill: {
    brand:
      'rounded-[1.875rem] border border-solid border-[#E65817] px-3 py-[0.37rem] text-md',
    neutral:
      'rounded-[1.875rem] border border-solid border-neutral-300 px-3 py-[0.37rem] text-md',
    inverse:
      'rounded-[1.875rem] border border-solid border-neutral-200 px-3 py-[0.37rem] text-md',
    muted:
      'rounded-[1.875rem] border border-solid border-neutral-400 px-3 py-[0.37rem] text-md text-neutral-500',
    inherit:
      'rounded-[1.875rem] border border-solid border-neutral-300 px-3 py-[0.37rem] text-md text-inherit',
  },
};

function getPillStateClass(tone: ButtonTone, selected?: boolean) {
  if (tone === 'brand') {
    return selected
      ? 'bg-[#E65817] text-[#202020]'
      : 'bg-[#202020] text-[#E65817]';
  }

  return selected
    ? 'bg-neutral-200 text-neutral-900'
    : 'bg-transparent text-neutral-600';
}

function getButtonClass({
  variant,
  tone,
  size,
  fullWidth,
  selected,
}: {
  variant: ButtonVariant;
  tone: ButtonTone;
  size: ButtonSize;
  fullWidth?: boolean;
  selected?: boolean;
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium transition duration-200';
  const widthClass = fullWidth ? 'w-full' : '';

  if (variant === 'pill') {
    return clsx(
      base,
      VARIANT_CLASSES.pill[tone],
      getPillStateClass(tone, selected),
      widthClass,
    );
  }

  if (variant === 'text') {
    return clsx(
      base,
      TEXT_SIZE_CLASSES[size],
      VARIANT_CLASSES[variant][tone],
      widthClass,
    );
  }

  return clsx(
    base,
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant][tone],
    widthClass,
  );
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    variant,
    tone = 'neutral',
    size = 'md',
    fullWidth,
    selected,
    iconLeft,
    iconRight,
    ariaLabel,
    children,
  } = props;

  const className = getButtonClass({
    variant,
    tone,
    size,
    fullWidth,
    selected,
  });

  const content = (
    <>
      {iconLeft}
      {children !== undefined && children !== null && <span>{children}</span>}
      {iconRight}
    </>
  );

  if (props.as === 'link') {
    return (
      <Link to={props.to} className={className} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  if (props.as === 'a') {
    return (
      <a
        href={props.href}
        className={className}
        target={props.target}
        rel={props.rel}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
      className={className}
      aria-pressed={variant === 'pill' ? selected : undefined}
      aria-label={ariaLabel}
      ref={ref}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
