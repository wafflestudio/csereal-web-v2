import { useReducer, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRevalidator } from 'react-router';
import { toast } from '~/components/ui/sonner';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import Form from '~/components/form/Form';
import AlertDialog from '~/components/ui/AlertDialog';
import Button from '~/components/ui/Button';
import { TABLE_COLUMN_SIZE } from '~/routes/about/future-careers/components/CareerCompanies';
import type { Company } from '~/types/api/v2/about/future-careers';
import { fetchOk } from '~/utils/fetch';

interface CompanyTableRowProps {
  index: number;
  company: Company;
}

export function CompanyTableRow({ index, company }: CompanyTableRowProps) {
  const [edit, toggleEdit] = useReducer((x) => !x, false);
  const revalidator = useRevalidator();

  const onSubmit = async (content: CareerCompanyFormData) => {
    try {
      await fetchOk(`/api/v2/about/future-careers/company/${company.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: company.id, ...content }),
      });

      toast.success('졸업생 창업 기업을 수정했습니다.');
      toggleEdit();
      revalidator.revalidate();
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  };

  return edit ? (
    <CareerCompanyEditor
      index={index}
      company={company}
      onSubmit={onSubmit}
      onCancel={toggleEdit}
    />
  ) : (
    <CareerCompanyViewer
      index={index}
      company={company}
      toggleEdit={toggleEdit}
    />
  );
}

function CareerCompanyViewer({
  index,
  company,
  toggleEdit,
}: CompanyTableRowProps & { toggleEdit: () => void }) {
  const { id, name, url, year } = company;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const revalidator = useRevalidator();

  const handleDelete = async () => {
    try {
      await fetchOk(`/api/v2/about/future-careers/company/${id}`, {
        method: 'DELETE',
      });

      setShowDeleteDialog(false);
      toast.success('졸업생 창업 기업을 삭제했습니다.');
      toggleEdit();
      revalidator.revalidate();
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  return (
    <>
      <li className="grid grid-cols-[22px_auto_1fr] items-center gap-x-1 px-7 py-6 odd:bg-neutral-100 sm:flex sm:h-10 sm:gap-3 sm:p-0 sm:px-3">
        <p
          className={`text-sm text-neutral-400 sm:pl-2 ${TABLE_COLUMN_SIZE[0]}`}
        >
          {index}
        </p>
        <p
          className={`text-md font-medium sm:pl-2 sm:text-sm sm:font-normal ${TABLE_COLUMN_SIZE[1]}`}
        >
          {name}
        </p>
        <a
          className={`order-last col-span-2 col-start-2 w-fit text-xs text-link hover:underline sm:order-0 sm:mt-0 sm:pl-2
            ${url && 'mt-1'} ${TABLE_COLUMN_SIZE[2]}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {url}
        </a>
        <p className={`pl-2 text-sm text-neutral-400 ${TABLE_COLUMN_SIZE[3]}`}>
          {year}
        </p>
        <LoginVisible allow="ROLE_STAFF">
          <div
            className={`hidden shrink-0 gap-2 sm:flex ${TABLE_COLUMN_SIZE[4]}`}
          >
            <Button
              variant="outline"
              tone="neutral"
              size="md"
              onClick={toggleEdit}
            >
              편집
            </Button>
            <Button
              variant="outline"
              tone="neutral"
              size="md"
              onClick={() => setShowDeleteDialog(true)}
            >
              삭제
            </Button>
          </div>
        </LoginVisible>
      </li>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        description="삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={handleDelete}
      />
    </>
  );
}

export interface CareerCompanyFormData {
  name: string;
  url: string;
  year: number;
}

export function CareerCompanyEditor({
  index,
  company,
  onSubmit,
  onCancel,
}: Partial<CompanyTableRowProps> & {
  onSubmit: (formData: CareerCompanyFormData) => Promise<void>;
  onCancel: () => void;
}) {
  const formMethods = useForm<CareerCompanyFormData>({
    defaultValues: {
      name: company?.name ?? '',
      url: company?.url ?? '',
      year: company?.year,
    },
  });
  const { handleSubmit } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <li className="grid grid-cols-[22px_auto_1fr] items-center gap-x-1 px-7 py-6 odd:bg-neutral-100 sm:flex sm:h-10 sm:gap-3 sm:p-0 sm:px-3">
        <p
          className={`text-sm text-neutral-400 sm:pl-2 ${TABLE_COLUMN_SIZE[0]}`}
        >
          {index}
        </p>
        <div
          className={`text-md font-medium sm:text-sm sm:font-normal ${TABLE_COLUMN_SIZE[1]}`}
        >
          <Form.Text name="name" maxWidth="w-full" />
        </div>
        <div
          className={`text-md font-medium sm:text-sm sm:font-normal ${TABLE_COLUMN_SIZE[2]}`}
        >
          <Form.Text name="url" maxWidth="w-full" />
        </div>
        <div
          className={`text-md font-medium sm:text-sm sm:font-normal ${TABLE_COLUMN_SIZE[3]}`}
        >
          <Form.Text
            name="year"
            maxWidth="w-full"
            type="number"
            options={{ valueAsNumber: true }}
          />
        </div>
        <LoginVisible allow="ROLE_STAFF">
          <div
            className={`hidden shrink-0 gap-2 sm:flex ${TABLE_COLUMN_SIZE[4]}`}
          >
            <Button
              variant="outline"
              tone="neutral"
              size="md"
              onClick={onCancel}
            >
              취소
            </Button>
            <Button
              variant="solid"
              tone="neutral"
              size="md"
              onClick={handleSubmit(onSubmit)}
            >
              저장
            </Button>
          </div>
        </LoginVisible>
      </li>
    </FormProvider>
  );
}
