import { Link } from 'react-router';
import Image from '~/components/ui/Image';
import { useLanguage } from '~/hooks/useLanguage';
import type { MainImportant } from '~/types/api/v2';
import charityImg from '../assets/charity.avif';
import ImportantArrowIcon from '../assets/important_arrow.svg?react';

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
    className="relative flex h-[7.5rem] flex-col gap-[0.62rem] px-[1.75rem] pt-[1.63rem]"
  >
    <Image
      src={charityImg}
      alt=""
      className="absolute inset-0 h-full w-full object-cover"
    />
    <h3 className="relative z-10 line-clamp-1 text-lg font-semibold text-neutral-950">
      SNU Computing Commons 건축기금 모금
    </h3>
    <p className="relative z-10 line-clamp-1 text-sm font-normal text-neutral-800">
      서울대학교 발전재단 X 컴퓨터공학부
    </p>
    <ImportantSectionArrow />
  </a>
);

const ImportantSectionArrow = () => (
  <ImportantArrowIcon className="absolute bottom-[0.87rem] right-[0.87rem]" />
);
