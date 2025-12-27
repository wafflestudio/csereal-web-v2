import type { Route } from '.react-router/types/app/routes/reservations/$roomType/+types/$roomName';
import dayjs from 'dayjs';
import LoginVisible from '~/components/common/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import { useLanguage } from '~/hooks/useLanguage';
import { useNavItem } from '~/hooks/useNavItem';
import useIsMobile from '~/hooks/useResponsive';
import { useReservationsSubNav } from '~/hooks/useSubNav';
import { fetchWeeklyReservation } from '~/routes/reservations/api';
import ReservationCalendar, {
  type ReservationCalendarProps,
} from '~/routes/reservations/components/ReservationCalendar';
import {
  roomNameToId,
  STAFF_ONLY_ROOM_ID,
} from '~/routes/reservations/constants';
import {
  formatDateParam,
  getStartOfWeek,
  parseDateParam,
} from '~/utils/reservation';

export async function loader({ params, request }: Route.LoaderArgs) {
  const roomId = roomNameToId[params.roomName];
  if (roomId === undefined) throw new Error('Invalid room');

  const url = new URL(request.url);
  const selectedDateParam = url.searchParams.get('selectedDate');
  const selectedDate = selectedDateParam
    ? parseDateParam(selectedDateParam)
    : dayjs();

  if (!selectedDate.isValid()) throw new Error('Invalid date');

  const startOfWeek = getStartOfWeek(selectedDate);
  const [desktopReservations, mobileReservations] = await Promise.all([
    fetchWeeklyReservation(roomId, startOfWeek),
    fetchWeeklyReservation(roomId, selectedDate),
  ]);

  return {
    roomId,
    selectedDate: formatDateParam(selectedDate),
    desktopReservations,
    mobileReservations,
  };
}

export default function RoomReservationPage({
  loaderData: { roomId, desktopReservations, mobileReservations, selectedDate },
}: Route.ComponentProps) {
  const { t, tUnsafe } = useLanguage({
    '존재하지 않는 시설 아이디입니다.': 'Invalid room.',
    '유효하지 않은 날짜입니다.': 'Invalid date.',
    '관리자만 열람 가능합니다.': 'Only staff can view this room.',
  });

  const { activeItem } = useNavItem();
  const subNav = useReservationsSubNav();
  const isMobile = useIsMobile();

  // loader에서 처리하므로 여기서는 처리하지 않음
  if (!activeItem) return null;

  const title = activeItem ? tUnsafe(activeItem.key) : t('시설 예약');
  const props: ReservationCalendarProps = isMobile
    ? {
        reservations: mobileReservations,
        columnCount: 3,
        startDate: dayjs(selectedDate),
        roomId,
      }
    : {
        reservations: desktopReservations,
        columnCount: 7,
        startDate: getStartOfWeek(dayjs(selectedDate)),
        roomId,
      };

  const isStaffOnlyRoom = STAFF_ONLY_ROOM_ID.includes(roomId);

  return (
    <PageLayout title={title} titleSize="xl" subNav={subNav}>
      {isStaffOnlyRoom ? (
        <LoginVisible allow="ROLE_STAFF" fallback={<NonStaffFallback />}>
          <ReservationCalendar {...props} />
        </LoginVisible>
      ) : (
        <ReservationCalendar {...props} />
      )}
    </PageLayout>
  );
}

function NonStaffFallback() {
  const { t } = useLanguage({
    '관리자만 열람 가능합니다.': 'Only staff can view this room.',
  });
  return <div className="h-[400px]">{t('관리자만 열람 가능합니다.')}</div>;
}
