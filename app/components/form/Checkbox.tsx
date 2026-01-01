import clsx from 'clsx';
import type { ChangeHandler, RegisterOptions } from 'react-hook-form';
import { useFormContext, useWatch } from 'react-hook-form';

interface CheckboxProps {
  name: string;
  value?: string;
  label?: string;
  options?: RegisterOptions;
  disabled?: boolean;
  onChange?: (isChecked: boolean) => void;
}

export default function Checkbox({
  value,
  name,
  label = value,
  options,
  disabled = false,
  onChange: onChangeFromProp,
}: CheckboxProps) {
  const { register } = useFormContext();
  const tags = useWatch({ name });

  const isChecked = Array.isArray(tags) ? tags.includes(value) : Boolean(tags);
  const iconName = isChecked ? 'check_box' : 'check_box_outline_blank';

  const { onChange: onChangeFromRegister, ...registerProps } = register(
    name,
    options,
  );

  const onChange: ChangeHandler = (e) => {
    onChangeFromProp?.(!isChecked);
    return onChangeFromRegister(e);
  };

  return (
    <label
      htmlFor={value}
      className={clsx(
        'group flex h-5 w-fit items-center gap-1 whitespace-nowrap',
        {
          'cursor-pointer': !disabled,
        },
      )}
    >
      <span
        className={clsx(
          'material-symbols-rounded text-lg font-light text-neutral-400',
          !disabled &&
            'group-hover:text-neutral-600 group-active:text-main-orange',
          tags && 'text-neutral-600',
        )}
      >
        {iconName}
      </span>
      <span
        className={clsx(
          'text-md tracking-wide text-neutral-600',
          !disabled && 'group-active:text-main-orange',
        )}
      >
        {label}
      </span>
      <input
        type="checkbox"
        id={value}
        className="appearance-none"
        value={value}
        disabled={disabled}
        {...registerProps}
        onChange={onChange}
      />
    </label>
  );
}
