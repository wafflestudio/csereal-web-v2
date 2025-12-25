'use client';

import { useState } from 'react';
import { useRevalidator } from 'react-router';
import { toast } from 'sonner';
import AlertDialog from '~/components/common/AlertDialog';
import Button from '~/components/common/Button';
import HTMLViewer from '~/components/common/HTMLViewer';
import LoginVisible from '~/components/common/LoginVisible';
import SelectionTitle from '~/components/common/SelectionTitle';
import { useLanguage } from '~/hooks/useLanguage';
import type { Club } from '~/types/api/v2/about/student-clubs';
import { fetchOk } from '~/utils/fetch';

interface ClubDetailsProps {
  club: { ko: Club; en: Club };
  locale: 'ko' | 'en';
}

export default function ClubDetails({ club, locale }: ClubDetailsProps) {
  const revalidator = useRevalidator();
  const { localizedPath } = useLanguage();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const oppositeLocale = locale === 'ko' ? 'en' : 'ko';
  const image = club[locale].imageURL
    ? {
        src: club[locale].imageURL,
        width: 320,
        height: 200,
        mobileFullWidth: true,
      }
    : undefined;

  const handleDelete = async () => {
    try {
      await fetchOk(`/api/v2/about/student-clubs/${club.ko.id}`, {
        method: 'DELETE',
      });

      setShowDeleteDialog(false);
      toast.success('동아리를 삭제했습니다.');
      revalidator.revalidate();
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  return (
    <>
      <div>
        <div className="justify-between sm:flex items-start">
          <SelectionTitle
            title={club[locale].name}
            subtitle={club[oppositeLocale].name}
            animateKey={club[locale].name}
          />
          <LoginVisible allow="ROLE_STAFF">
            <div className="flex gap-3">
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
                to={localizedPath(
                  `/about/student-clubs/edit?selected=${club.ko.id}`,
                )}
                variant="outline"
                tone="neutral"
                size="md"
              >
                편집
              </Button>
            </div>
          </LoginVisible>
        </div>
        <HTMLViewer html={club[locale].description} image={image} />
      </div>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        description="동아리를 삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={handleDelete}
      />
    </>
  );
}
