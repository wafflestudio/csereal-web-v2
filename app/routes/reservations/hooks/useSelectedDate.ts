import dayjs from 'dayjs';
import { useSearchParams } from 'react-router';
import { formatDateParam, parseDateParam } from '~/utils/reservation';

export default function useSelectedDate() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDateParam = searchParams.get('selectedDate');
  const parsed = selectedDateParam
    ? parseDateParam(selectedDateParam)
    : dayjs();
  const selectedDate = parsed.isValid() ? parsed : dayjs();

  const setSelectedDate = (date: dayjs.Dayjs) => {
    const next = new URLSearchParams(searchParams);
    next.set('selectedDate', formatDateParam(date));
    setSearchParams(next, { preventScrollReset: true });
  };

  return { selectedDate, setSelectedDate };
}
