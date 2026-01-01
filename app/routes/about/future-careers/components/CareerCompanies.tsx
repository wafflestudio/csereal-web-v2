import { useReducer } from 'react';
import { toast } from '~/components/ui/sonner';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import Button from '~/components/ui/Button';
import { useLanguage } from '~/hooks/useLanguage';
import {
  CareerCompanyEditor,
  type CareerCompanyFormData,
  CompanyTableRow,
} from '~/routes/about/future-careers/components/CompanyRow';
import type { Company } from '~/types/api/v2/about/future-careers';
import { fetchOk } from '~/utils/fetch';

export const TABLE_COLUMN_SIZE = [
  'sm:w-[3rem]',
  'sm:w-[12.5rem]',
  'sm:w-80',
  'sm:w-20',
  'sm:w-32',
];

export default function CareerCompanies({
  companies,
}: {
  companies: Company[];
}) {
  const { t } = useLanguage({ '졸업생 창업 기업': 'Startup Companies' });
  const [showCreateForm, toggleCreateForm] = useReducer((x) => !x, false);

  const onCreate = async (content: CareerCompanyFormData) => {
    try {
      await fetchOk('/api/v2/about/future-careers/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      toast.success('졸업생 창업 기업을 추가했습니다.');
      toggleCreateForm();
      window.location.reload();
    } catch {
      toast.error('추가에 실패했습니다.');
    }
  };

  return (
    <div className="mt-11 sm:max-w-fit">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-base font-bold">{t('졸업생 창업 기업')}</h3>
        {/* UI가 과하게 깨지는 관계로 모바일 버전에서는 편집 X */}
        <div className="hidden sm:block">
          <LoginVisible allow="ROLE_STAFF">
            <Button
              variant="solid"
              tone="brand"
              size="md"
              onClick={toggleCreateForm}
              disabled={showCreateForm}
            >
              기업 추가
            </Button>
          </LoginVisible>
        </div>
      </div>
      <div className="border-y border-neutral-200 text-sm font-normal">
        <CompanyTableHeader />
        {showCreateForm && (
          <CareerCompanyEditor
            onCancel={toggleCreateForm}
            onSubmit={onCreate}
          />
        )}
        <ol>
          {companies.map((company, index) => (
            <CompanyTableRow
              key={company.id}
              index={index + 1}
              company={company}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}

function CompanyTableHeader() {
  const { t } = useLanguage({
    연번: 'No.',
    '창업 기업명': 'Company Name',
    홈페이지: 'Website',
    창업연도: 'Year Founded',
  });

  return (
    <div className="hidden h-10 items-center gap-3 whitespace-nowrap border-b border-neutral-200 sm:flex sm:px-3">
      <p className={TABLE_COLUMN_SIZE[0]}>{t('연번')}</p>
      <p className={`${TABLE_COLUMN_SIZE[1]} pl-2`}>{t('창업 기업명')}</p>
      <p className={`${TABLE_COLUMN_SIZE[2]} pl-2`}>{t('홈페이지')}</p>
      <p className={`${TABLE_COLUMN_SIZE[3]} pl-2`}>{t('창업연도')}</p>
      {/* 표 본문과 UI 정렬을 맞추기 위함 */}
      <LoginVisible allow="ROLE_STAFF">
        <p className={`hidden shrink-0 sm:block ${TABLE_COLUMN_SIZE[4]}`} />
      </LoginVisible>
    </div>
  );
}
