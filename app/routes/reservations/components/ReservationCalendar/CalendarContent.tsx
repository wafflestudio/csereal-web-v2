import dayjs from 'dayjs';
import { useState } from 'react';
import useIsMobile from '~/hooks/useResponsive';
import type { ReservationPreview } from '~/types/api/v2/reservation';
import CalendarColumn from './CalendarColumn';
import ReservationDetailModal from './ReservationDetailModal';

export default function CalendarContent({
  reservations,
  columnCount,
  startDate,
}: {
  reservations: ReservationPreview[];
  columnCount: number;
  startDate: dayjs.Dayjs;
}) {
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | null
  >(null);

  const dates = Array.from({ length: columnCount }, (_, i) =>
    startDate.add(i, 'day'),
  );

  return (
    <>
      <div className="flex border-b border-neutral-200">
        <RowIndex />
        {dates.map((date) => (
          <CalendarColumn
            key={date.valueOf()}
            date={date}
            selected={date.isSame(dayjs(), 'day')}
            reservations={reservations.filter(({ startTime }) =>
              dayjs(startTime).isSame(date, 'day'),
            )}
            onSelectReservation={setSelectedReservationId}
          />
        ))}
      </div>
      <ReservationDetailModal
        reservationId={selectedReservationId}
        open={selectedReservationId !== null}
        onOpenChange={(open) => !open && setSelectedReservationId(null)}
      />
    </>
  );
}

const RowIndex = () => {
  const isMobile = useIsMobile();

  const rows = [
    ...Array(4)
      .fill(0)
      .map((_, x) => `${x + 8}${isMobile ? '' : 'AM'}`),
    isMobile ? '12' : '12PM',
    ...Array(10)
      .fill(0)
      .map((_, x) => `${x + 1}${isMobile ? '' : 'PM'}`),
  ];

  return (
    <div>
      <div className="h-16.25 border-y border-r border-neutral-200 bg-neutral-100" />
      {rows.map((x, idx) => (
        <div
          key={idx}
          className="flex h-12 items-center justify-center border-b border-r border-neutral-200 bg-neutral-100 px-4"
        >
          <time className="text-xs font-medium text-neutral-800">{x}</time>
        </div>
      ))}
    </div>
  );
};
