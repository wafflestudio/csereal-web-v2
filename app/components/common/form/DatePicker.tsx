import clsx from 'clsx';
import dayjs from 'dayjs';
import { useReducer, useRef } from 'react';
import { useController } from 'react-hook-form';
import Calendar from '~/components/common/Calendar';
import { useClickOutside } from '~/hooks/useClickOutside';

interface DateProps {
  name: string;
  hideTime?: boolean;
  onSelect?: (date: Date) => void;
  buttonClassName?: string;
  calendarClassName?: string;
  disablePast?: boolean;
}

export default function DatePicker({
  name,
  hideTime = false,
  onSelect,
  buttonClassName,
  calendarClassName,
  disablePast = false,
}: DateProps) {
  const {
    field: { value, onChange },
  } = useController({ name });

  const [showCalendar, toggleCalendar] = useReducer((x) => !x, false);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  const date = value as Date;

  useClickOutside(calendarRef, () => {
    if (showCalendar) toggleCalendar();
  });

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);
    onChange(newDate);
  };

  const formatTime = (d: Date): string => {
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const disabled = disablePast
    ? (() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return { before: today };
      })()
    : undefined;

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <button
          type="button"
          className={clsx(
            'flex h-7.5 items-center gap-2 rounded-sm border border-neutral-300 bg-white px-2.5 text-sm hover:bg-neutral-50',
            buttonClassName,
          )}
          onClick={toggleCalendar}
        >
          <span className="material-symbols-rounded text-sm">
            calendar_month
          </span>
          {dayjs(date).format('YYYY.MM.DD.')}
        </button>
        {showCalendar && (
          <div className="relative" ref={calendarRef}>
            <div className={clsx('absolute top-2 z-10', calendarClassName)}>
              <Calendar
                selected={date}
                disabled={disabled}
                onSelect={(selectedDate) => {
                  const newDate = new Date(selectedDate);
                  newDate.setHours(date.getHours(), date.getMinutes());
                  onChange(newDate);
                  onSelect?.(newDate);
                  toggleCalendar();
                }}
              />
            </div>
          </div>
        )}
      </div>
      {!hideTime && (
        // TODO: design
        <input
          type="time"
          value={formatTime(date)}
          onChange={handleTimeChange}
          className="h-7.5 rounded-sm border border-neutral-300 px-2.5 text-sm outline-none"
        />
      )}
    </div>
  );
}
