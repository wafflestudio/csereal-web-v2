import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from '~/components/ui/sonner';
import Fieldset from '~/components/form/Fieldset';
import Form from '~/components/form/Form';
import PageLayout from '~/components/layout/PageLayout';
import { useLanguage } from '~/hooks/useLanguage';
import { useAboutSubNav } from '~/hooks/useSubNav';
import { fetchOk } from '~/utils/fetch';

const COMPANY_LIST = [
  'SAMSUNG',
  'LG',
  'LARGE',
  'SMALL',
  'GRADUATE',
  'OTHER',
] as const;
type Company = (typeof COMPANY_LIST)[number];
const DEGREE_LIST = ['bachelor', 'master', 'doctor'] as const;
type Degree = (typeof DEGREE_LIST)[number];

const COMPANY_MAP: Record<Company, string> = {
  SAMSUNG: '삼성',
  LG: 'LG',
  LARGE: '기타 대기업',
  SMALL: '중소기업',
  GRADUATE: '진학',
  OTHER: '기타',
};

const DEGREE_MAP: Record<Degree, string> = {
  bachelor: '학부',
  master: '석사',
  doctor: '박사',
};

type Stat = { career: Company } & { [key in Degree]: number };

interface CareerStat {
  year: number;
  statList: Stat[];
}

const DEFAULT_STATS: CareerStat = {
  year: new Date().getFullYear() + 1,
  statList: COMPANY_LIST.map((company) => ({
    career: company,
    bachelor: 0,
    master: 0,
    doctor: 0,
  })),
};

export default function CareerStatCreatePage() {
  const { t, localizedPath } = useLanguage({
    '졸업생 진로': 'Future Careers',
  });
  const subNav = useAboutSubNav();
  const navigate = useNavigate();

  const formMethods = useForm<CareerStat>({ defaultValues: DEFAULT_STATS });
  const { handleSubmit } = formMethods;

  const onCancel = () => navigate(localizedPath('/about/future-careers'));

  const onSubmit = async (content: CareerStat) => {
    try {
      await fetchOk('/api/v2/about/future-careers/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      toast.success('졸업생 진로 현황을 추가했습니다.');
      navigate(localizedPath('/about/future-careers'));
    } catch {
      toast.error('추가에 실패했습니다.');
    }
  };

  return (
    <PageLayout title="졸업생 진로 현황 추가" titleSize="xl" subNav={subNav}>
      <FormProvider {...formMethods}>
        <Form>
          <Fieldset title="연도" spacing="6" required>
            <Form.Text name="year" maxWidth="w-[55px]" />
          </Fieldset>

          <div className="border-y border-neutral-300 text-xs font-normal sm:w-[432px]">
            <TableHeader />
            <TableBody />
          </div>
          <Form.Action onCancel={onCancel} onSubmit={handleSubmit(onSubmit)} />
        </Form>
      </FormProvider>
    </PageLayout>
  );
}

function TableHeader() {
  return (
    <div className="flex h-9 flex-1 border-b border-neutral-300 bg-neutral-100">
      <div className="w-25" />
      {DEGREE_LIST.map((degree) => (
        <div key={degree} className="flex flex-1 items-center justify-center">
          <p className="text-sm">{DEGREE_MAP[degree]}</p>
        </div>
      ))}
    </div>
  );
}

function TableBody() {
  const { control } = useFormContext<CareerStat>();
  const statList = useWatch({ name: 'statList', control });

  return statList.map((stat, idx) => (
    <div
      key={idx}
      className="flex flex-1 flex-row border-b border-neutral-200 last:border-0"
    >
      <div className="flex w-25 items-center justify-center bg-neutral-100 text-sm">
        {COMPANY_MAP[stat.career]}
      </div>
      {DEGREE_LIST.map((degree) => (
        <div
          key={degree}
          className="flex flex-1 items-center justify-center py-1.5 text-md"
        >
          <Form.Text
            name={`statList.${idx}.${degree}`}
            maxWidth="max-w-[80px]"
            textCenter
          />
        </div>
      ))}
    </div>
  ));
}
