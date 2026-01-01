import dayjs from 'dayjs';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRevalidator } from 'react-router';
import { toast } from '~/components/ui/sonner';
import { postReservation } from '~/routes/reservations/api';
import type { ReservationPostBody } from '~/types/api/v2/reservation';
import {
  getEarliestStartTimeFrom,
  getEndTimeOptions,
  getOptimalEndTime,
  getStartTimeOptions,
  isChecked,
} from '~/utils/reservation';

type ReservationFormValues = Omit<
  ReservationPostBody,
  'startTime' | 'endTime' | 'roomId'
> & {
  date: Date;
  startTime: string;
  endTime: string;
};

interface ReservationFormOptions {
  roomId: number;
  onSuccess: () => void;
}

const getDefaultBodyValue = (): ReservationFormValues => {
  const start = getEarliestStartTimeFrom(new Date());
  const end = new Date(start);
  end.setTime(end.getTime() + 30 * 60 * 1000);

  return {
    date: start,
    startTime: dayjs(start).format('HH:mm'),
    endTime: dayjs(end).format('HH:mm'),
    recurringWeeks: 1,
    title: '',
    contactEmail: '',
    contactPhone: '',
    professor: '',
    purpose: '',
    agreed: false,
  };
};

const handleError = (error: unknown) => {
  if (error instanceof Error) {
    switch (error.message) {
      case '409':
        toast.error('해당 위치에 이미 예약이 존재합니다.');
        return;
      case '403':
        toast.error('대학원생은 교수 회의실을 예약할 수 없습니다.');
        return;
      case '401':
        toast.error('관리자만 예약을 추가할 수 있습니다.');
        return;
      default:
        toast.error('예약에 실패했습니다.');
        return;
    }
  }

  toast.error('알 수 없는 에러가 발생했습니다.');
};

const buildDate = (date: Date, time: string) => {
  const [hour, minute] = time.split(':').map(Number);
  const next = new Date(date);
  next.setHours(hour, minute, 0, 0);
  return next;
};

const toDropdownOptions = (values: string[]) =>
  values.map((value) => ({ value, label: value }));

export default function useReservationForm({
  roomId,
  onSuccess,
}: ReservationFormOptions) {
  const revalidator = useRevalidator();
  const defaultValuesRef = useRef(getDefaultBodyValue());
  const methods = useForm<ReservationFormValues>({
    defaultValues: defaultValuesRef.current,
    mode: 'onChange',
    shouldFocusError: false,
  });
  const { isSubmitting, isValid } = methods.formState;

  const dateValue = methods.watch('date');
  const startTimeValue = methods.watch('startTime');
  const endTimeValue = methods.watch('endTime');

  const startDate = buildDate(dateValue, startTimeValue);
  const endDate = buildDate(dateValue, endTimeValue);
  const startOptions = getStartTimeOptions(startDate, new Date());
  const endOptions = getEndTimeOptions(startDate);

  const startOptionItems = toDropdownOptions(startOptions);
  const endOptionItems = toDropdownOptions(endOptions);
  const recurringOptions = Array.from({ length: 20 }, (_, index) => {
    const value = index + 1;
    return { value, label: `${value}` };
  });

  const updateDate = (date: Date) => {
    let nextStart = buildDate(date, startTimeValue);

    if (dayjs(nextStart).isSame(dayjs(), 'day')) {
      nextStart = getEarliestStartTimeFrom(nextStart);
    }

    const nextEnd = getOptimalEndTime({
      prevStart: startDate,
      prevEnd: endDate,
      newStart: nextStart,
    });

    methods.setValue('date', date);
    methods.setValue('startTime', dayjs(nextStart).format('HH:mm'));
    methods.setValue('endTime', dayjs(nextEnd).format('HH:mm'));
  };

  const updateStartTime = (value: string) => {
    const nextStart = buildDate(dateValue, value);
    const nextEnd = getOptimalEndTime({
      prevStart: startDate,
      prevEnd: endDate,
      newStart: nextStart,
    });

    methods.setValue('startTime', dayjs(nextStart).format('HH:mm'));
    methods.setValue('endTime', dayjs(nextEnd).format('HH:mm'));
  };

  const updateEndTime = (value: string) => {
    methods.setValue('endTime', value);
  };

  const onSubmit = methods.handleSubmit(
    async (data) => {
      const payload: ReservationPostBody = {
        roomId,
        startTime: buildDate(data.date, data.startTime).toISOString(),
        endTime: buildDate(data.date, data.endTime).toISOString(),
        recurringWeeks: data.recurringWeeks,
        title: data.title,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        professor: data.professor,
        purpose: data.purpose,
        agreed: isChecked(data.agreed as unknown),
      };

      try {
        await postReservation(payload);
        toast.success('예약을 추가했습니다.');
        revalidator.revalidate();
        methods.reset(defaultValuesRef.current);
        onSuccess();
      } catch (error) {
        handleError(error);
      }
    },
    () => {
      toast.info('모든 필수 정보를 입력해주세요.');
    },
  );

  return {
    methods,
    isSubmitting,
    isValid,
    startOptionItems,
    endOptionItems,
    recurringOptions,
    updateDate,
    updateStartTime,
    updateEndTime,
    onSubmit,
  };
}
