import type { Route } from '.react-router/types/app/routes/research/centers/+types/index';
import { useState } from 'react';
import { type LoaderFunctionArgs, useRevalidator } from 'react-router';
import { toast } from 'sonner';
import AlertDialog from '~/components/common/AlertDialog';
import Button from '~/components/common/Button';
import HTMLViewer from '~/components/common/HTMLViewer';
import LoginVisible from '~/components/common/LoginVisible';
import Node from '~/components/common/Nodes';
import SelectionList from '~/components/common/SelectionList';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useSelectionList } from '~/hooks/useSelectionList';
import { useResearchSubNav } from '~/hooks/useSubNav';
import type { ResearchCentersResponse } from '~/types/api/v2/research/centers';
import { fetchJson, fetchOk } from '~/utils/fetch';
import { getLocaleFromPathname } from '~/utils/string';
import LinkIcon from './assets/link_icon.svg?react';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);

  const params = new URLSearchParams();
  params.append('language', locale);

  const response = await fetch(
    `${BASE_URL}/v2/research/centers?${params.toString()}`,
  );
  if (!response.ok) throw new Error('Failed to fetch research centers');

  return (await response.json()) as ResearchCentersResponse;
}

export default function ResearchCentersPage({
  loaderData: centers,
}: Route.ComponentProps) {
  const { t, localizedPath } = useLanguage({
    '연구 센터는 존재하지 않습니다.': 'Research center does not exist.',
  });
  const subNav = useResearchSubNav();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const revalidator = useRevalidator();

  const { selectedItem: selectedCenter, selectionItems } = useSelectionList({
    items: centers,
    getItem: (center) => ({ id: center.id, label: center.name }),
  });

  const handleDelete = async () => {
    if (!selectedCenter) return;

    try {
      // 상세 정보를 가져와서 ko, en ID를 얻음
      const data = await fetchJson<{ ko: { id: number }; en: { id: number } }>(
        `${BASE_URL}/v2/research/${selectedCenter.id}`,
      );

      await fetchOk(`/api/v2/research/${data.ko.id}/${data.en.id}`, {
        method: 'DELETE',
      });

      toast.success('연구 센터를 삭제했습니다.');
      revalidator.revalidate();
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  return (
    <PageLayout
      title={t('연구 센터')}
      titleSize="xl"
      breadcrumb={[
        { name: t('연구·교육'), path: '/research' },
        { name: t('연구 센터'), path: '/research/centers' },
      ]}
      subNav={subNav}
      padding="none"
    >
      <div className="px-7 sm:pl-[100px] sm:pr-[320px]">
        <LoginVisible allow="ROLE_STAFF">
          <div className="mt-11 text-right">
            <Button
              as="link"
              to={localizedPath('/research/centers/create')}
              variant="solid"
              tone="brand"
              size="md"
            >
              연구 센터 추가
            </Button>
          </div>
        </LoginVisible>
        <SelectionList items={selectionItems} />
      </div>
      {selectedCenter && (
        <div className="px-7 pb-9 sm:pb-[100px] sm:pl-[100px] sm:pr-[320px]">
          <LoginVisible allow="ROLE_STAFF">
            <div className="mb-7 flex justify-end gap-3">
              <Button
                as="button"
                onClick={() => setShowDeleteDialog(true)}
                variant="outline"
                tone="neutral"
                size="md"
              >
                삭제
              </Button>
              <Button
                as="link"
                to={localizedPath(
                  `/research/centers/${selectedCenter.id}/edit`,
                )}
                variant="outline"
                tone="neutral"
                size="md"
              >
                편집
              </Button>
            </div>
          </LoginVisible>
          <ResearchCenterTitle
            name={selectedCenter.name}
            link={selectedCenter.websiteURL}
          />
          <div className="px-2.5">
            <HTMLViewer
              html={selectedCenter.description}
              image={
                selectedCenter.mainImageUrl && {
                  src: selectedCenter.mainImageUrl,
                  width: 320,
                  height: 200,
                  mobileFullWidth: true,
                }
              }
            />
          </div>
        </div>
      )}
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        description="이 연구 센터를 삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={handleDelete}
      />
    </PageLayout>
  );
}

function ResearchCenterTitle({ name, link }: { name: string; link: string }) {
  return (
    <div className="mb-5 sm:w-fit" key={name}>
      <h4 className="px-2.5 text-base font-bold leading-loose text-neutral-800 sm:text-[24px]">
        <a
          href={link}
          target="_blank"
          className="group flex cursor-pointer items-center gap-1"
          rel="noopener noreferrer"
        >
          <span className="text-base font-bold sm:text-[24px]">{name}</span>
          <LinkIcon className="mt-0.5 fill-neutral-500 group-hover:fill-main-orange" />
        </a>
      </h4>
      <div className="animate-stretch">
        <Node variant="straight" />
      </div>
    </div>
  );
}
