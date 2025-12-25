import dayjs, { type Dayjs } from 'dayjs';
import type { ElementType, ReactNode } from 'react';
import 'dayjs/locale/ko';
import { Link, useSearchParams } from 'react-router';
import Image from '~/components/common/Image';
import { useLanguage } from '~/hooks/useLanguage';
import type { SeminarPreview } from '~/types/api/v2/seminar';
import CalendarIcon from '../assets/calendar.svg?react';
import DistanceIcon from '../assets/distance.svg?react';
import PersonIcon from '../assets/person.svg?react';

interface SeminarRowProps {
  seminar: SeminarPreview;
}

export default function SeminarRow({
  seminar: { id, imageURL, title, name, affiliation, startDate, location },
}: SeminarRowProps) {
  const [searchParams] = useSearchParams();
  const { locale, localizedPath } = useLanguage();
  const pageNum = searchParams.get('pageNum');
  const detailPath = pageNum
    ? `${localizedPath(`/community/seminar/${id}`)}?pageNum=${pageNum}`
    : localizedPath(`/community/seminar/${id}`);

  return (
    <Link to={detailPath} className="group">
      <article className="flex flex-col gap-4 sm:flex-row sm:gap-5">
        <ImageCell imageURL={imageURL} />
        <div className="flex flex-col items-start gap-1 break-all sm:gap-0">
          <TitleCell title={title} />
          <div className="flex flex-col gap-0.5">
            <HostInformationCell host={name} company={affiliation} />
            <DateAndLocationCell
              date={dayjs(startDate).locale(locale)}
              location={location}
            />
          </div>
        </div>
      </article>
    </Link>
  );
}

function ImageCell({ imageURL }: { imageURL: string | null }) {
  return (
    <div
      className={`relative h-40 w-40 shrink-0 sm:h-25 sm:w-25 ${
        !imageURL ? 'bg-neutral-100' : ''
      }`}
    >
      {imageURL && (
        <Image
          src={imageURL}
          alt="대표 이미지"
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}

function TitleCell({ title }: { title: string }) {
  return (
    <h3 className="mb-1 grow font-bold group-hover:underline sm:mb-5">
      {title}
    </h3>
  );
}

function HostInformationCell({
  host,
  company,
}: {
  host: string;
  company: string;
}) {
  return (
    <div className="flex flex-wrap gap-x-0.5">
      <IconTextWrapper>
        <IconWrapper IconComponent={PersonIcon} />
        <Text text={host} />
      </IconTextWrapper>
      <VerticalDivider />
      <Text text={company} />
    </div>
  );
}

function DateAndLocationCell({
  date,
  location,
}: {
  date: Dayjs;
  location: string;
}) {
  return (
    <div className="flex flex-wrap gap-0.5">
      <IconTextWrapper>
        <IconWrapper IconComponent={CalendarIcon} />
        <Text text={date.format('YYYY/M/DD (ddd) A hh:mm')} />
      </IconTextWrapper>
      <VerticalDivider />
      <IconTextWrapper>
        <IconWrapper IconComponent={DistanceIcon} />
        <Text text={location} />
      </IconTextWrapper>
    </div>
  );
}

function IconTextWrapper({ children }: { children: ReactNode }) {
  return <div className="flex items-start gap-0.5">{children}</div>;
}

function IconWrapper({ IconComponent }: { IconComponent: ElementType }) {
  return <IconComponent className="shrink-0 -translate-y-0.5" />;
}

function Text({ text }: { text: string }) {
  return (
    <span className="pt-0 text-md font-normal text-neutral-500">{text}</span>
  );
}

function VerticalDivider() {
  return (
    <span className="w-4 text-center text-md font-normal text-neutral-500 sm:w-5">
      |
    </span>
  );
}
