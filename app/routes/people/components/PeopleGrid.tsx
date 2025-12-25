import { Link } from 'react-router';
import Image from '~/components/common/Image';

interface PeopleGridProps {
  items: PeopleCardProps[];
}

export default function PeopleGrid({ items }: PeopleGridProps) {
  return (
    <div className="grid max-w-[800px] gap-16 sm:grid-cols-[repeat(auto-fit,144px)]">
      {items.map((item) => (
        <PeopleCard key={item.id} {...item} />
      ))}
    </div>
  );
}

export interface PeopleCardContentItem {
  text: string;
  href?: string;
}

export interface PeopleCardProps {
  id: string | number;
  imageURL: string | null;
  name: string;
  subtitle: string;
  href: string;
  titleNewline?: boolean;
  content: PeopleCardContentItem[];
}

function PeopleCard({
  imageURL,
  name,
  subtitle,
  href,
  titleNewline = false,
  content,
}: PeopleCardProps) {
  return (
    <article className="group flex w-fit flex-row gap-5 text-md sm:w-36 sm:flex-col sm:gap-3">
      <Link
        to={href}
        className="relative h-48 w-36 shrink-0 cursor-pointer overflow-hidden drop-shadow-[0px_0px_4px_rgba(0,0,0,0.15)]"
        aria-label={`${name} 교수 상세 페이지로 이동`}
      >
        {imageURL ? (
          <Image
            src={imageURL}
            alt={`${name} 프로필`}
            className="h-[192px] w-[144px] object-cover"
            width={144}
            height={192}
            loading="lazy"
          />
        ) : (
          <div className="h-[192px] w-[144px] bg-neutral-200" />
        )}
      </Link>
      <div className="flex flex-col items-start break-keep">
        <Link
          to={href}
          className={`relative flex w-full cursor-pointer flex-row flex-wrap gap-2 pb-2.5 ${
            titleNewline ? 'flex-col' : ''
          }`}
        >
          <span className="text-[18px] font-bold">{name}</span>
          <AcademicRankText academicRank={subtitle} />
          <HoverAnimationUnderline />
        </Link>

        <div className="mt-2.5 flex flex-col items-start gap-2 break-keep">
          {content.map(({ text, href }, idx) =>
            href ? (
              <Link
                key={`${text}-${idx}`}
                to={href}
                className="hover:underline"
              >
                <p>{text}</p>
              </Link>
            ) : (
              <p key={`${text}-${idx}`}>{text}</p>
            ),
          )}
        </div>
      </div>
    </article>
  );
}

const HoverAnimationUnderline = () => (
  <>
    <span className="absolute bottom-0 inline-block w-full border-b border-neutral-200" />
    <span className="absolute bottom-0 inline-block w-0 border-b border-main-orange transition-all duration-700 ease-out group-hover:w-full" />
  </>
);

function AcademicRankText({ academicRank }: { academicRank: string }) {
  return (
    <p className="mb-px flex flex-wrap items-end text-neutral-500">
      {academicRank.split('(').map((rank, i) =>
        i === 0 ? (
          <span key={rank}>{rank}</span>
        ) : (
          <span
            key={rank}
            className="inline-block origin-left scale-75 whitespace-nowrap"
          >
            ({rank}
          </span>
        ),
      )}
    </p>
  );
}
