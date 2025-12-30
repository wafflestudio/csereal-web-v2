import type { ReactNode } from 'react';
import { FormProvider } from 'react-hook-form';
import { Link } from 'react-router';
import Form from '~/components/form/Form';
import Button from '~/components/ui/Button';
import Dialog from '~/components/ui/Dialog';
import { useLanguage } from '~/hooks/useLanguage';
import useReservationForm from '~/routes/reservations/hooks/useReservationForm';

interface AddReservationModalProps {
  roomId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddReservationModal({
  roomId,
  open,
  onOpenChange,
}: AddReservationModalProps) {
  const { t, localizedPath } = useLanguage({
    '시설 예약': 'Reservation',
    예약하기: 'Reserve',
    취소: 'Cancel',
    '개인정보 수집 및 이용동의': 'Privacy Agreement',
    보러가기: 'View',
  });

  const {
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
  } = useReservationForm({
    roomId,
    onSuccess: () => onOpenChange(false),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      ariaLabel={t('시설 예약')}
      contentClassName="border-b border-t-[3px] border-main-orange bg-neutral-100 px-7 pb-6 pt-7 text-md text-neutral-700"
    >
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <h2 className="mb-7 text-xl font-bold">{t('시설 예약')}</h2>

          <div className="mb-6 flex flex-col items-start gap-3">
            <fieldset className="flex items-center gap-2">
              <label htmlFor="date" className="font-normal">
                예약 날짜:
              </label>
              <Form.Date
                name="date"
                hideTime
                disablePast
                onSelect={updateDate}
                buttonClassName="h-7 border-neutral-200 text-sm font-normal"
                calendarClassName="absolute top-2 z-10"
              />
            </fieldset>

            <div className="flex flex-wrap gap-3">
              <fieldset className="flex items-center gap-2">
                <label htmlFor="startTime" className="font-normal">
                  시작 시간:
                </label>
                <Form.Dropdown
                  name="startTime"
                  contents={startOptionItems}
                  borderStyle="border-neutral-200"
                  height="h-7"
                  onChange={(value) => updateStartTime(String(value))}
                />
              </fieldset>
              <fieldset className="flex items-center gap-2">
                <label htmlFor="endTime" className="font-normal">
                  종료 시간:
                </label>
                <Form.Dropdown
                  name="endTime"
                  contents={endOptionItems}
                  borderStyle="border-neutral-200"
                  height="h-7"
                  onChange={(value) => updateEndTime(String(value))}
                />
              </fieldset>
            </div>

            <fieldset className="flex items-center gap-2">
              <label htmlFor="recurringWeeks" className="font-normal">
                매주 반복:
              </label>
              <Form.Dropdown
                name="recurringWeeks"
                contents={recurringOptions}
                borderStyle="border-neutral-200"
                height="h-7"
                onChange={(value) => {
                  methods.setValue('recurringWeeks', Number(value));
                }}
              />
              회
            </fieldset>
          </div>

          <div className="mb-6 flex flex-col gap-2">
            <Fieldset title="단체 이름" required>
              <Form.Text
                name="title"
                bgColor="bg-neutral-50"
                className="h-7 w-full border-neutral-200"
                placeholder=""
                options={{ validate: (value) => value.trim() !== '' }}
              />
            </Fieldset>
            <Fieldset title="연락가능 이메일" required>
              <Form.Text
                name="contactEmail"
                type="email"
                bgColor="bg-neutral-50"
                className="h-7 w-full border-neutral-200"
                options={{ validate: (value) => value.trim() !== '' }}
              />
            </Fieldset>
            <Fieldset title="연락가능 전화번호" required>
              <Form.Text
                name="contactPhone"
                type="tel"
                bgColor="bg-neutral-50"
                className="h-7 w-full border-neutral-200"
              />
            </Fieldset>
            <Fieldset title="지도교수" required>
              <Form.Text
                name="professor"
                bgColor="bg-neutral-50"
                className="h-7 w-full border-neutral-200"
                placeholder=""
                options={{ validate: (value) => value.trim() !== '' }}
              />
            </Fieldset>

            <Fieldset title="사용 목적" required fullWidth>
              <Form.TextArea
                name="purpose"
                className="h-14 border-neutral-200 bg-neutral-50"
                options={{ validate: (value) => value.trim() !== '' }}
              />
            </Fieldset>

            <div className="items-center flex gap-1 text-neutral-400">
              <span className="material-symbols-outlined my-auto text-base">
                error
              </span>
              <p className="font-normal">
                예약 시간 20분 후까지 사용하지 않을 시 예약이 취소됩니다.
              </p>
            </div>
          </div>

          <fieldset className="mb-6 flex flex-col font-normal">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                <Form.Checkbox
                  name="agreed"
                  value="true"
                  label={t('개인정보 수집 및 이용동의')}
                  options={{ validate: (value) => value === 'true' }}
                />
                <span className="text-main-orange">*</span>
              </div>

              <Link
                className="text-neutral-400"
                to={localizedPath('/reservations/privacy-policy')}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('보러가기')}
                <span className="material-symbols-outlined translate-y-[3px] text-base">
                  chevron_right
                </span>
              </Link>
            </div>
          </fieldset>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              tone="neutral"
              size="md"
              onClick={() => onOpenChange(false)}
            >
              {t('취소')}
            </Button>
            <Button
              variant="solid"
              tone="brand"
              size="md"
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              {t('예약하기')}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Dialog>
  );
}

function Fieldset({
  title,
  required = false,
  fullWidth = false,
  children,
}: {
  title: string;
  required?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}) {
  return (
    <fieldset className={`${fullWidth ? '' : 'w-88'} font-normal`}>
      <legend className="mb-1">
        {title}
        {required && <span className="text-main-orange">*</span>}
      </legend>
      {children}
    </fieldset>
  );
}
