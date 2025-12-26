import type { Route } from '.react-router/types/app/routes/research/groups/+types/index';
import { useState } from 'react';
import {
  Link,
  type LoaderFunctionArgs,
  useNavigate,
  useRevalidator,
} from 'react-router';
import { toast } from 'sonner';
import AlertDialog from '~/components/common/AlertDialog';
import Button from '~/components/common/Button';
import HTMLViewer from '~/components/common/HTMLViewer';
import Image from '~/components/common/Image';
import LoginVisible from '~/components/common/LoginVisible';
import SelectionList from '~/components/common/SelectionList';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useSelectionList } from '~/hooks/useSelectionList';
import { useResearchSubNav } from '~/hooks/useSubNav';
import type { ResearchGroupsResponse } from '~/types/api/v2/research/groups';
import { fetchJson, fetchOk } from '~/utils/fetch';
import { getLocaleFromPathname } from '~/utils/string';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);

  const params = new URLSearchParams();
  params.append('language', locale);

  const response = await fetch(
    `${BASE_URL}/v2/research/groups?${params.toString()}`,
  );
  if (!response.ok) throw new Error('Failed to fetch research groups');

  return (await response.json()) as ResearchGroupsResponse;
}

export default function ResearchGroupsPage({
  loaderData: groups,
}: Route.ComponentProps) {
  const { t, localizedPath } = useLanguage({
    '연구 스트림은 존재하지 않습니다.': 'Research stream does not exist.',
    스트림: 'Stream',
    연구실: 'Labs',
  });
  const subNav = useResearchSubNav();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const revalidator = useRevalidator();

  const { selectedItem: item, selectionItems: items } = useSelectionList({
    items: groups,
    getItem: (group) => ({ id: group.name, label: group.name }),
  });

  const labsPath = localizedPath('/research/labs');

  const handleDelete = async () => {
    if (!item) return;

    try {
      // 상세 정보를 가져와서 ko, en ID를 얻음
      const data = await fetchJson<{ ko: { id: number }; en: { id: number } }>(
        `${BASE_URL}/v2/research/${item.id}`,
      );

      await fetchOk(`/api/v2/research/${data.ko.id}/${data.en.id}`, {
        method: 'DELETE',
      });

      toast.success('연구 스트림을 삭제했습니다.');
      revalidator.revalidate();
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  return (
    <PageLayout
      title={t('연구·교육 스트림')}
      titleSize="xl"
      breadcrumb={[
        { name: t('연구·교육'), path: '/research' },
        { name: t('연구·교육 스트림'), path: '/research/groups' },
      ]}
      subNav={subNav}
      padding="none"
    >
      <div className="px-7 sm:pl-[100px] sm:pr-[320px]">
        <LoginVisible allow="ROLE_STAFF">
          <div className="mt-11 text-right">
            <Button
              as="link"
              to={localizedPath('/research/groups/create')}
              variant="solid"
              tone="brand"
              size="md"
            >
              연구 스트림 추가
            </Button>
          </div>
        </LoginVisible>
        <SelectionList items={items} />
      </div>
      {item && (
        <div className="flex flex-col bg-neutral-100 px-7 pb-9 pt-8 sm:pb-[100px] sm:pl-[100px] sm:pr-[320px] sm:pt-[50px]">
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
                to={localizedPath(`/research/groups/${item.id}/edit`)}
                variant="outline"
                tone="neutral"
                size="md"
              >
                편집
              </Button>
            </div>
          </LoginVisible>
          <h2 className="mb-6 ml-1 whitespace-nowrap text-base font-bold leading-loose sm:mx-0 sm:mb-[18px] sm:text-[24px]">
            {item.name} {t('스트림')}
          </h2>
          <div className="max-w-[780px] bg-white p-[18px] sm:p-[40px]">
            <HTMLViewer html={item.description} />
          </div>
          {item.mainImageUrl && (
            <div className="relative mt-10 aspect-2/1 w-[80%] max-w-[720px] self-end">
              <Image
                src={item.mainImageUrl}
                alt={`${item.name} 연구 스트림 사진`}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="mt-10 sm:mx-0">
            <h3 className="mb-1 whitespace-nowrap text-md font-bold leading-loose sm:py-1 sm:pl-2.5 sm:text-[20px]">
              {t('연구실')}
            </h3>
            <ul>
              {item.labs.map((lab) => (
                <li key={lab.id} className="mb-0.5 w-fit whitespace-nowrap">
                  <Link
                    to={`${labsPath}/${lab.id}`}
                    className="group flex h-7 items-center gap-2.5 sm:px-3"
                  >
                    <span className="h-2.5 w-2.5 rounded-full border border-main-orange duration-300 group-hover:bg-main-orange" />
                    <span className="text-sm font-medium duration-300 group-hover:text-main-orange sm:text-md">
                      {lab.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        description="이 연구 스트림을 삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={handleDelete}
      />
    </PageLayout>
  );
}
