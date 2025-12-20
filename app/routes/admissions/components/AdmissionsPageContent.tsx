import HTMLViewer from '~/components/common/HTMLViewer';
import PageLayout from '~/components/layout/PageLayout';
import { useLanguage } from '~/hooks/useLanguage';
import { useNavItem } from '~/hooks/useNavItem';
import { useAdmissionsSubNav } from '~/hooks/useSubNav';

interface AdmissionsPageContentProps {
  description: string;
  layout?: 'default' | 'extraBottom';
}

export default function AdmissionsPageContent({
  description,
  layout = 'default',
}: AdmissionsPageContentProps) {
  const { t, tUnsafe } = useLanguage();
  const { activeItem } = useNavItem();
  const subNav = useAdmissionsSubNav();
  const title = activeItem ? tUnsafe(activeItem.key) : t('입학');
  const breadcrumb = activeItem?.path
    ? [
        { name: t('입학'), path: '/admissions' },
        { name: tUnsafe(activeItem.key), path: activeItem.path },
      ]
    : [{ name: t('입학'), path: '/admissions' }];
  const wrapperClass = layout === 'extraBottom' ? 'pb-16 sm:pb-[220px]' : '';

  return (
    <PageLayout
      title={title}
      titleSize="xl"
      breadcrumb={breadcrumb}
      subNav={subNav}
      padding={layout === 'extraBottom' ? 'noBottom' : 'default'}
    >
      <div className={wrapperClass}>
        <HTMLViewer html={description} />
      </div>
    </PageLayout>
  );
}
