import { useState } from 'react';
import Button from '~/components/common/Button';
import Dropdown from '~/components/common/Dropdown';
import LoginVisible from '~/components/common/LoginVisible';
import { useLanguage } from '~/hooks/useLanguage';
import type { YearStat } from '~/types/api/v2/about/future-careers';

const CAREER_STAT_ROWS = [
  '삼성',
  'LG',
  '기타 대기업',
  '중소기업',
  '진학',
  '기타',
];
const CAREER_STAT_COLS = ['학부', '석사', '박사'];

export default function CareerStat({ stat }: { stat: YearStat[] }) {
  const [idx, setIdx] = useState(0);
  const { t, localizedPath } = useLanguage({
    '졸업생 진로 현황': 'Career Path Statistics',
  });

  const year = stat[idx].year;
  const yearStat = stat.find((x) => x.year === year);

  if (!yearStat) return <p>선택된 연도의 자료가 없습니다.</p>;

  return (
    <div className="mt-7 flex flex-col gap-3">
      <div className="flex justify-between sm:w-[432px]">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold">{t('졸업생 진로 현황')}</h3>
          <Dropdown
            contents={stat.map((x) => x.year.toString())}
            selectedIndex={idx}
            onClick={setIdx}
            height="h-9"
          />
        </div>
        <LoginVisible allow="ROLE_STAFF">
          <div className="flex gap-3">
            <Button
              as="link"
              to={localizedPath('/about/future-careers/stat/create')}
              variant="solid"
              tone="brand"
              size="md"
            >
              연도 추가
            </Button>
            <Button
              as="link"
              to={localizedPath(`/about/future-careers/stat/edit?year=${year}`)}
              variant="outline"
              tone="neutral"
              size="md"
            >
              편집
            </Button>
          </div>
        </LoginVisible>
      </div>

      <div className="border-y border-neutral-300 text-xs font-normal sm:w-[432px]">
        <TableHeader />
        {CAREER_STAT_ROWS.map((company, index) => (
          <TableRow
            key={index}
            rowName={company}
            values={[
              yearStat.bachelor.find((x) => x.name === company)?.count ?? 0,
              yearStat.master.find((x) => x.name === company)?.count ?? 0,
              yearStat.doctor.find((x) => x.name === company)?.count ?? 0,
            ]}
          />
        ))}
      </div>
    </div>
  );
}

function TableHeader() {
  return (
    <div className="flex h-8 flex-1 border-b border-neutral-300 bg-neutral-100">
      <div className="w-25" />
      {CAREER_STAT_COLS.map((colName) => (
        <div key={colName} className="flex flex-1 items-center justify-center">
          <p className="text-sm">{colName}</p>
        </div>
      ))}
    </div>
  );
}

function TableRow({ rowName, values }: { rowName: string; values: number[] }) {
  return (
    <div className="flex h-8 flex-1 flex-row border-b border-neutral-200 last:border-0">
      <div className="flex w-25 items-center justify-center bg-neutral-100 text-sm">
        {rowName}
      </div>
      {values.map((value, index) => (
        <div
          key={index}
          className="flex flex-1 items-center justify-center text-md"
        >
          {value}
        </div>
      ))}
    </div>
  );
}
