import { Link } from 'react-router';
import { useLanguage } from '~/hooks/useLanguage';
import type { MainImportant } from '~/types/api/v2';
import charityImg from '../assets/charity.png';

export default function ImportantSection({
  importantList,
}: {
  importantList: MainImportant[];
}) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-8 sm:mx-[7.5rem] sm:mt-[4.0625rem] sm:grid-cols-2 sm:gap-7">
      {importantList.map((important) => (
        <ImportantBanner key={important.id} important={important} />
      ))}
      <CharityBanner />
    </div>
  );
}

const ImportantBanner = ({ important }: { important: MainImportant }) => {
  const { localizedPath } = useLanguage();

  return (
    <Link
      to={localizedPath(`/community/${important.category}/${important.id}`)}
      className="relative flex h-[7.5rem] flex-col gap-[0.62rem] bg-[#E65817] px-[1.75rem] pt-[1.63rem]"
    >
      <h3 className="line-clamp-1 text-lg font-semibold text-neutral-950">
        {important.title}
      </h3>
      <p className="mr-[24px] line-clamp-1 text-sm font-normal text-neutral-800">
        {important.description}
      </p>
      <ImportantSectionArrow />
    </Link>
  );
};

const CharityBanner = () => (
  <a
    href="https://computingcommons.snu.ac.kr/"
    className="relative flex h-[7.5rem] flex-col gap-[0.62rem] bg-cover px-[1.75rem] pt-[1.63rem]"
    style={{ backgroundImage: `url(${charityImg})` }}
  >
    <h3 className="line-clamp-1 text-lg font-semibold text-neutral-950">
      SNU Computing Commons 건축기금 모금
    </h3>
    <p className="line-clamp-1 text-sm font-normal text-neutral-800">
      서울대학교 발전재단 X 컴퓨터공학부
    </p>
    <ImportantSectionArrow />
  </a>
);

const ImportantSectionArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    className="absolute bottom-[0.87rem] right-[0.87rem]"
  >
    <path
      d="M14.0076 5L23 13.9924M23 13.9924L14.0076 23M23 13.9924L5 13.9924"
      stroke="#0A0A0A"
      strokeWidth="1.5"
    />
  </svg>
);
