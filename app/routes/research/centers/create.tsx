import { useNavigate } from 'react-router';
import { toast } from '~/components/ui/sonner';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { fetchOk } from '~/utils/fetch';
import { FormData2 } from '~/utils/form';
import ResearchCenterEditor, {
  type ResearchCenterFormData,
} from './components/ResearchCenterEditor';

export default function ResearchCenterCreate() {
  const navigate = useNavigate();
  const { locale } = useLanguage();

  const onCancel = () => {
    navigate(`/${locale}/research/centers`);
  };

  const onSubmit = async ({ ko, en, image }: ResearchCenterFormData) => {
    const formData = new FormData2();

    formData.appendJson('request', { ko, en });
    formData.appendIfLocal('newMainImage', image);

    try {
      await fetchOk(`${BASE_URL}/v2/research`, {
        method: 'POST',
        body: formData,
      });

      toast.success('연구 센터를 추가했습니다.');
      navigate(`/${locale}/research/centers`);
    } catch {
      toast.error('추가에 실패했습니다.');
    }
  };

  return (
    <PageLayout title="연구 센터 추가" titleSize="xl" padding="default">
      <ResearchCenterEditor onCancel={onCancel} onSubmit={onSubmit} />
    </PageLayout>
  );
}
