import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useRevalidator } from 'react-router';
import { toast } from 'sonner';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import AlertDialog from '~/components/ui/AlertDialog';
import Button from '~/components/ui/Button';
import Dialog from '~/components/ui/Dialog';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import {
  deleteRecurringReservation,
  deleteReservation,
} from '~/routes/reservations/api';
import type { Reservation } from '~/types/api/v2/reservation';

interface ReservationDetailModalProps {
  reservationId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const translations = {
  '예약 목적 미기입': 'No purpose provided',
  '예약 날짜': 'Reservation Date',
  '시작 시간': 'Start Time',
  '종료 시간': 'End Time',
  '매주 반복': 'Weekly Repeat',
  '예약 위치': 'Location',
  '예약자 정보': 'Requester Info',
  계정: 'Account',
  이메일: 'Email',
  핸드폰: 'Phone',
  회: 'times',
  불러오는중: 'Loading...',
  예약상세: 'Reservation Detail',
  삭제: 'Delete',
  '해당 예약만 삭제': 'Delete this reservation',
  '반복 예약 전체 삭제': 'Delete all recurring reservations',
  '해당 예약을 삭제하시겠습니까?': 'Delete this reservation?',
  '반복 예약을 모두 삭제하시겠습니까?': 'Delete all recurring reservations?',
};

export default function ReservationDetailModal({
  reservationId,
  open,
  onOpenChange,
}: ReservationDetailModalProps) {
  const { t } = useLanguage(translations);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteRecurringDialog, setShowDeleteRecurringDialog] =
    useState(false);
  const revalidator = useRevalidator();

  useEffect(() => {
    if (!open || reservationId === null) return;
    setReservation(null);

    (async () => {
      const response = await fetch(`/api/v2/reservation/${reservationId}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch reservation detail');
      const data = (await response.json()) as Reservation;
      setReservation(data);
    })();
  }, [open, reservationId]);

  if (!open || reservationId === null) return null;

  const handleDelete = async () => {
    if (!reservation) return;

    try {
      await deleteReservation(reservation.id);
      toast.success('예약을 삭제했습니다.');
      setShowDeleteDialog(false);
      onOpenChange(false);
      revalidator.revalidate();
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  const handleDeleteRecurring = async () => {
    if (!reservation) return;

    try {
      await deleteRecurringReservation(reservation.recurrenceId);
      toast.success('예약을 삭제했습니다.');
      setShowDeleteRecurringDialog(false);
      onOpenChange(false);
      revalidator.revalidate();
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <div className="min-w-[320px]">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-800">
              {reservation?.title ?? t('불러오는중')}
            </h2>
          </div>

          <div className="mb-[2.19rem] flex flex-col gap-6">
            <p className="text-neutral-800">
              {reservation
                ? (reservation.purpose ?? t('예약 목적 미기입'))
                : '-'}
            </p>

            <div className="flex flex-col gap-[6px]">
              <Row
                title={t('예약 날짜')}
                body={
                  reservation
                    ? dayjs(reservation.startTime).format('YY.MM.DD')
                    : '-'
                }
              />
              <Row
                title={t('시작 시간')}
                body={
                  reservation
                    ? dayjs(reservation.startTime).format('HH:mm')
                    : '-'
                }
              />
              <Row
                title={t('종료 시간')}
                body={
                  reservation ? dayjs(reservation.endTime).format('HH:mm') : '-'
                }
              />
              <Row
                title={t('매주 반복')}
                body={
                  reservation ? `${reservation.recurringWeeks}${t('회')}` : '-'
                }
              />
            </div>

            <Row
              title={t('예약 위치')}
              body={reservation?.roomLocation ?? '-'}
            />

            <div className="flex flex-col gap-[6px]">
              <p className="text-md font-normal text-neutral-400">
                {t('예약자 정보')}
              </p>
              <Row title={t('계정')} body={reservation?.userName ?? '-'} />
              <Row
                title={t('이메일')}
                body={reservation?.contactEmail ?? '-'}
              />
              <Row
                title={t('핸드폰')}
                body={reservation?.contactPhone ?? '-'}
              />
            </div>
          </div>
          <LoginVisible allow={['ROLE_STAFF', 'ROLE_RESERVATION']}>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                tone="neutral"
                size="sm"
                onClick={() => setShowDeleteRecurringDialog(true)}
              >
                {t('반복 예약 전체 삭제')}
              </Button>
              <Button
                variant="outline"
                tone="neutral"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                {t('해당 예약만 삭제')}
              </Button>
            </div>
          </LoginVisible>
        </div>
      </Dialog>
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        description={t('해당 예약을 삭제하시겠습니까?')}
        confirmText={t('삭제')}
        onConfirm={handleDelete}
      />
      <AlertDialog
        open={showDeleteRecurringDialog}
        onOpenChange={setShowDeleteRecurringDialog}
        description={t('반복 예약을 모두 삭제하시겠습니까?')}
        confirmText={t('삭제')}
        onConfirm={handleDeleteRecurring}
      />
    </>
  );
}

const Row = ({ title, body }: { title: string; body: string }) => {
  return (
    <div className="flex gap-3">
      <p className="w-16.25 text-md text-neutral-500">{title}</p>
      <p className="text-md text-neutral-800">{body}</p>
    </div>
  );
};
