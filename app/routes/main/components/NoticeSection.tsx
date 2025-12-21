'use client';

import 'dayjs/locale/ko';
import dayjs from 'dayjs';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link } from 'react-router';
import Button from '~/components/common/Button';
import { useLanguage } from '~/hooks/useLanguage';
import useResponsive from '~/hooks/useResponsive';
import type { AllMainNotice } from '~/types/api/v2';
import noticeGraphicImg from '../assets/noticeGraphic.png';
import PlusIcon from '../assets/plus.svg?react';

export default function NoticeSection({
  allMainNotice,
}: {
  allMainNotice: AllMainNotice;
}) {
  const [tag, setTag] = useState<keyof AllMainNotice>('all');
  const isMobile = useResponsive();
  const { t, localizedPath, locale } = useLanguage();

  return (
    <div className="relative mt-16 bg-[#212121] sm:mx-31 sm:mt-22 sm:h-112">
      <div className="absolute left-0 top-0 hidden aspect-827/295 w-[77%] sm:block">
        <img
          src={noticeGraphicImg}
          alt=""
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            inset: 0,
          }}
        />
      </div>
      <div className="flex flex-col px-7 pb-6.5 pt-12 sm:absolute sm:bottom-12 sm:right-12 sm:w-132 sm:p-0">
        <h3 className="text-[1.75rem] font-semibold text-white">
          {t('공지사항')}
        </h3>
        <div className="mt-6 flex items-center justify-between sm:mt-9">
          <div className="flex gap-3.5">
            <NoticeSectionButton
              selected={tag === 'all'}
              onClick={() => setTag('all')}
            >
              {t('전체')}
            </NoticeSectionButton>
            <NoticeSectionButton
              selected={tag === 'scholarship'}
              onClick={() => setTag('scholarship')}
            >
              {t('장학')}
            </NoticeSectionButton>
            <NoticeSectionButton
              selected={tag === 'undergraduate'}
              onClick={() => setTag('undergraduate')}
            >
              {t('학부')}
            </NoticeSectionButton>
            <NoticeSectionButton
              selected={tag === 'graduate'}
              onClick={() => setTag('graduate')}
            >
              {t('대학원')}
            </NoticeSectionButton>
          </div>
          {!isMobile && (
            <Link
              className="flex text-base font-normal text-[#E65817]"
              to={localizedPath('/community/notice')}
            >
              <Plus /> {t('더보기')}
            </Link>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {allMainNotice[tag].map((notice) => (
            <Link
              key={notice.id}
              className="line-clamp-1 flex justify-between gap-2 text-md font-normal text-white sm:text-base"
              to={localizedPath(`/community/notice/${notice.id}`)}
            >
              <h3 className="truncate sm:w-108">{notice.title}</h3>
              <p className="whitespace-nowrap">
                {dayjs(notice.createdAt)
                  .locale(locale)
                  .format(
                    locale === 'ko' ? 'YYYY/M/DD (ddd)' : 'YYYY/M/DD ddd',
                  )}
              </p>
            </Link>
          ))}
        </div>
        {isMobile && (
          <Link
            className="ml-auto mt-6 flex text-base font-normal text-[#E65817]"
            to={localizedPath('/community/notice')}
          >
            <PlusIcon /> {t('더보기')}
          </Link>
        )}
      </div>
    </div>
  );
}

const NoticeSectionButton = ({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) => {
  return (
    <Button
      variant="pill"
      tone="brand"
      size="md"
      selected={selected}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
