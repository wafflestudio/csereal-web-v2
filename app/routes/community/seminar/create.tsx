import { useNavigate } from 'react-router';
import { toast } from '~/components/ui/sonner';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { isLocalFile } from '~/types/form';
import { fetchOk } from '~/utils/fetch';
import { FormData2 } from '~/utils/form';
import SeminarEditor, {
  type SeminarFormData,
} from './components/SeminarEditor';

export default function SeminarCreatePage() {
  const navigate = useNavigate();
  const { locale } = useLanguage({});

  const onCancel = () => {
    navigate(`/${locale}/community/seminar`);
  };

  const onSubmit = async (content: SeminarFormData) => {
    const formData = new FormData2();

    formData.appendJson('request', {
      title: content.title,
      titleForMain: content.titleForMain || null,
      description: content.description || null,
      location: content.location,
      startDate: content.startDate.toISOString(),
      endDate: content.endDate ? content.endDate.toISOString() : null,
      host: content.host || null,
      name: content.name || null,
      speakerURL: content.speakerURL || null,
      speakerTitle: content.speakerTitle || null,
      affiliation: content.affiliation || null,
      affiliationURL: content.affiliationURL || null,
      introduction: content.introduction || null,
      isPrivate: content.isPrivate,
      isImportant: content.isImportant,
    });

    formData.appendIfLocal('mainImage', content.image);
    formData.appendIfLocal(
      'attachments',
      content.attachments.filter(isLocalFile),
    );

    try {
      await fetchOk(`${BASE_URL}/v2/seminar`, {
        method: 'POST',
        body: formData,
      });

      toast.success('세미나를 게시했습니다.');
      navigate(`/${locale}/community/seminar`);
    } catch {
      toast.error('게시에 실패했습니다.');
    }
  };

  return (
    <PageLayout title="세미나 작성" titleSize="xl" padding="default">
      <SeminarEditor onCancel={onCancel} onSubmit={onSubmit} />
    </PageLayout>
  );
}
