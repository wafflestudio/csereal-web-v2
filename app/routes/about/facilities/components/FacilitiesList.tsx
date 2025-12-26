import { useState } from 'react';
import { useRevalidator } from 'react-router';
import { toast } from 'sonner';
import AlertDialog from '~/components/common/AlertDialog';
import Button from '~/components/common/Button';
import HTMLViewer from '~/components/common/HTMLViewer';
import Image from '~/components/common/Image';
import LoginVisible from '~/components/common/LoginVisible';
import { useLanguage } from '~/hooks/useLanguage';
import type { Facility } from '~/types/api/v2/about/facilities';
import { fetchOk } from '~/utils/fetch';
import distanceIcon from '../assets/distance.svg';

export default function FacilitiesList({
  facilities,
}: {
  facilities: Facility[];
}) {
  return (
    <div className="mt-[-20px] flex flex-col divide-y divide-neutral-200">
      {facilities.map((facility) => (
        <FacilitiesRow key={facility.id} facility={facility} />
      ))}
    </div>
  );
}

function FacilitiesRow({ facility }: { facility: Facility }) {
  const { localizedPath } = useLanguage({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const revalidator = useRevalidator();

  const handleDelete = async () => {
    try {
      await fetchOk(`/api/v2/about/facilities/${facility.id}`, {
        method: 'DELETE',
      });

      setShowDeleteDialog(false);
      toast.success('시설을 삭제했습니다.');
      revalidator.revalidate();
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  return (
    <>
      <article className="flex flex-col-reverse items-start justify-between gap-5 py-5 sm:flex-row">
        <div className="flex flex-col sm:w-142">
          <h3 className="mb-3 text-base font-bold leading-5">
            {facility.name}
          </h3>
          <HTMLViewer html={facility.description} />
          <div className="flex translate-x-[-4px] items-start gap-px">
            <Image src={distanceIcon} alt="" className="shrink-0" />
            <p className="pt-0.5 text-md text-neutral-500">
              {facility.locations.join(', ')}
            </p>
          </div>
          <LoginVisible allow="ROLE_STAFF">
            <div className="mt-5 flex gap-3">
              <Button
                variant="outline"
                tone="neutral"
                size="md"
                onClick={() => setShowDeleteDialog(true)}
              >
                삭제
              </Button>
              <Button
                as="link"
                to={localizedPath(`/about/facilities/edit?id=${facility.id}`)}
                variant="outline"
                tone="neutral"
                size="md"
              >
                편집
              </Button>
            </div>
          </LoginVisible>
        </div>
        <FacilitiesRowImage imageURL={facility.imageURL ?? ''} />
      </article>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        description="시설을 삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={handleDelete}
      />
    </>
  );
}

function FacilitiesRowImage({ imageURL }: { imageURL: string }) {
  return (
    <div className="relative h-44 w-full shrink-0 sm:w-60">
      <Image
        alt="대표 이미지"
        src={encodeURI(imageURL)}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
