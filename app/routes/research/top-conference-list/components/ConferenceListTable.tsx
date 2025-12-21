import { useLanguage } from '~/hooks/useLanguage';
import type { TopConferenceListResponse } from '~/types/api/v2/conference';

interface ConferenceListTableProps {
  conferenceList: TopConferenceListResponse['conferenceList'];
}

export default function ConferenceListTable({
  conferenceList,
}: ConferenceListTableProps) {
  const { t } = useLanguage({
    연번: 'No.',
    약칭: 'Abbr.',
    '학술대회 명칭': 'Conference Name',
  });

  return (
    <div className="overflow-x-scroll">
      <div className="mt-8 flex w-[720px] flex-col text-sm">
        <div className="flex h-10 w-full flex-row border-y border-y-neutral-200">
          <div className="flex w-12 items-center justify-center px-3">
            {t('연번')}
          </div>
          <div className="flex w-28 items-center px-3">{t('약칭')}</div>
          <div className="flex w-[540px] items-center px-3">
            {t('학술대회 명칭')}
          </div>
        </div>
        {conferenceList.map((conference, index) => (
          <ConferenceRow
            conference={conference}
            index={index + 1}
            key={conference.id}
          />
        ))}
      </div>
    </div>
  );
}

function ConferenceRow({
  conference,
  index,
}: {
  conference: TopConferenceListResponse['conferenceList'][number];
  index: number;
}) {
  return (
    <div className="flex w-full flex-row items-center wrap-break-word text-sm leading-[18px] even:bg-neutral-100">
      <div className="flex w-12 items-center justify-center px-3 py-2.5">
        {index}
      </div>
      <div className="flex w-28 items-center px-3 py-2.5">
        {conference.abbreviation}
      </div>
      <div className="flex w-[540px] items-center px-3 py-2.5">
        {conference.name}
      </div>
    </div>
  );
}
