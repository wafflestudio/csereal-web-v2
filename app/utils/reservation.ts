import dayjs from 'dayjs';

export const parseDateParam = (value: string) => {
  return dayjs(value, 'YYYY-MM-DD', true);
};

export const formatDateParam = (date: dayjs.Dayjs) => {
  return date.format('YYYY-MM-DD');
};

export const getStartOfWeek = (date: dayjs.Dayjs) => {
  const diff = (date.day() || 7) - 1;
  return date.subtract(diff, 'day');
};

export const getOptimalEndTime = ({
  prevStart,
  prevEnd,
  newStart,
}: {
  prevStart: Date;
  prevEnd: Date;
  newStart: Date;
}): Date => {
  const previousDiff =
    newStart.getTime() + prevEnd.getTime() - prevStart.getTime();
  let newEnd = new Date(previousDiff);

  if (
    newEnd.getDate() !== newStart.getDate() ||
    (23 <= newEnd.getHours() && 0 < newEnd.getMinutes())
  ) {
    newEnd = new Date(newStart);
    newEnd.setHours(23, 0, 0, 0);
  }

  return newEnd;
};

export const getEarliestStartTimeFrom = (date: Date) => {
  let startTime = new Date(date);

  const now = new Date();
  if (startTime < now) startTime = now;

  startTime.setSeconds(0);
  startTime.setMilliseconds(0);

  if (30 < startTime.getMinutes()) {
    startTime = new Date(startTime.getTime() + 30 * 60 * 1000);
    startTime.setMinutes(0);
  } else {
    startTime.setMinutes(30);
  }

  if (
    startTime.getHours() < 8 ||
    23 <= startTime.getHours() ||
    (startTime.getHours() === 22 && 30 < startTime.getMinutes())
  ) {
    startTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000);
    startTime.setHours(8, 0, 0, 0);
  }

  return startTime;
};

export const getStartTimeOptions = (selected: Date, now: Date) => {
  let options = Array.from({ length: 15 }, (_, index) => 8 + index).flatMap(
    (hour) => [
      `${String(hour).padStart(2, '0')}:00`,
      `${String(hour).padStart(2, '0')}:30`,
    ],
  );

  if (dayjs(selected).isSame(dayjs(now), 'day')) {
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    options = options.filter((value) => {
      const [hour, minute] = value.split(':').map(Number);
      return hour * 60 + minute >= nowMinutes;
    });
  }

  return options.length > 0 ? options : ['08:00'];
};

export const getEndTimeOptions = (startTime: Date) => {
  const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
  const lastMinutes = 23 * 60;
  const options: string[] = [];

  for (let minute = startMinutes + 30; minute <= lastMinutes; minute += 30) {
    const hour = Math.floor(minute / 60);
    const minutes = minute % 60;
    options.push(
      `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
    );
  }

  return options;
};

export const isChecked = (value: unknown) => value === true || value === 'true';
