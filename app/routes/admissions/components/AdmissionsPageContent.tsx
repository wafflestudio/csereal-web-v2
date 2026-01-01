import LoginVisible from '~/components/feature/auth/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import Button from '~/components/ui/Button';
import HTMLViewer from '~/components/ui/HTMLViewer';
import { useLanguage } from '~/hooks/useLanguage';
import { useNavItem } from '~/hooks/useNavItem';
import { useAdmissionsSubNav } from '~/hooks/useSubNav';
import type { ProcessedHtml } from '~/utils/csp';

interface AdmissionsPageContentProps {
  description: ProcessedHtml;
  layout?: 'default' | 'extraBottom';
  mainType?: string;
  postType?: string;
}

const META: Record<
  string,
  Record<
    string,
    {
      ko: { title: string; description: string };
      en: { title: string; description: string };
    }
  >
> = {
  undergraduate: {
    'regular-admission': {
      ko: {
        title: '학부 정시모집',
        description:
          '서울대학교 컴퓨터공학부 학부 정시모집 안내입니다. 수능 성적을 기반으로 한 지원 자격, 전형 일정, 제출 서류 등을 확인하실 수 있습니다.',
      },
      en: {
        title: 'Undergraduate Regular Admission',
        description:
          'Regular admission information for undergraduate programs at the Department of Computer Science and Engineering, Seoul National University.',
      },
    },
    'early-admission': {
      ko: {
        title: '학부 수시모집',
        description:
          '서울대학교 컴퓨터공학부 학부 수시모집 안내입니다. 일반전형, 기회균형선발특별전형 등 다양한 전형의 지원 자격과 일정을 확인하실 수 있습니다.',
      },
      en: {
        title: 'Undergraduate Early Admission',
        description:
          'Early admission information for undergraduate programs at the Department of Computer Science and Engineering, Seoul National University.',
      },
    },
  },
  graduate: {
    'regular-admission': {
      ko: {
        title: '대학원 입학',
        description:
          '서울대학교 컴퓨터공학부 대학원 입학 안내입니다. 석사 및 박사 과정 지원 자격, 전형 일정, 제출 서류 등을 확인하실 수 있습니다.',
      },
      en: {
        title: 'Graduate Admission',
        description:
          'Graduate admission information for masters and doctoral programs at the Department of Computer Science and Engineering, Seoul National University.',
      },
    },
  },
  international: {
    undergraduate: {
      ko: {
        title: '외국인 학부 입학',
        description:
          '서울대학교 컴퓨터공학부 외국인 학부 입학 안내입니다. 지원 자격, 전형 일정, 제출 서류 등을 확인하실 수 있습니다.',
      },
      en: {
        title: 'International Undergraduate Admission',
        description:
          'Admission information for international undergraduate students at the Department of Computer Science and Engineering, Seoul National University.',
      },
    },
    graduate: {
      ko: {
        title: '외국인 대학원 입학',
        description:
          '서울대학교 컴퓨터공학부 외국인 대학원 입학 안내입니다. 지원 자격, 전형 일정, 제출 서류 등을 확인하실 수 있습니다.',
      },
      en: {
        title: 'International Graduate Admission',
        description:
          'Admission information for international graduate students at the Department of Computer Science and Engineering, Seoul National University.',
      },
    },
    exchange: {
      ko: {
        title: '교환/방문학생',
        description:
          '서울대학교 컴퓨터공학부 교환학생 및 방문학생 프로그램 안내입니다. 지원 자격, 신청 절차, 프로그램 안내 등을 확인하실 수 있습니다.',
      },
      en: {
        title: 'Exchange & Visiting Students',
        description:
          'Exchange and visiting student program information at the Department of Computer Science and Engineering, Seoul National University.',
      },
    },
    scholarships: {
      ko: {
        title: '외국인 장학 제도',
        description:
          '서울대학교 컴퓨터공학부 외국인 학생을 위한 장학 제도를 안내합니다. 다양한 장학금 종류와 지원 자격을 확인하실 수 있습니다.',
      },
      en: {
        title: 'International Student Scholarships',
        description:
          'Scholarship programs for international students at the Department of Computer Science and Engineering, Seoul National University.',
      },
    },
  },
};

export default function AdmissionsPageContent({
  description,
  layout = 'default',
  mainType,
  postType,
}: AdmissionsPageContentProps) {
  const { t, tUnsafe, localizedPath, locale } = useLanguage();
  const { activeItem } = useNavItem();
  const subNav = useAdmissionsSubNav();
  const title = activeItem ? tUnsafe(activeItem.key) : t('입학');
  const wrapperClass = layout === 'extraBottom' ? 'pb-16 sm:pb-[220px]' : '';

  // activeItem.path가 있으면 자동으로 editPath 생성
  const editPath = activeItem?.path ? `${activeItem.path}/edit` : null;

  // 메타데이터 생성
  const meta =
    mainType && postType && META[mainType]?.[postType]
      ? META[mainType][postType][locale]
      : undefined;

  return (
    <PageLayout
      title={title}
      titleSize="xl"
      subNav={subNav}
      padding={layout === 'extraBottom' ? 'noBottom' : 'default'}
      pageTitle={meta?.title}
      pageDescription={meta?.description}
    >
      {editPath && (
        <LoginVisible allow="ROLE_STAFF">
          <div className="mb-7 text-right">
            <Button
              as="link"
              to={localizedPath(editPath)}
              variant="outline"
              tone="neutral"
              size="md"
            >
              편집
            </Button>
          </div>
        </LoginVisible>
      )}
      <div className={wrapperClass}>
        <HTMLViewer html={description} />
      </div>
    </PageLayout>
  );
}
