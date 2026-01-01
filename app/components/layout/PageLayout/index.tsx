import type { ReactNode } from 'react';
import { useBreadcrumb } from '~/hooks/useBreadcrumb';
import { useLanguage } from '~/hooks/useLanguage';
import type { SubNavConfig } from '~/hooks/useSubNav';
import { SITE_NAME } from '~/utils/metadata';
import Header from '../Header';
import PageTitle from './PageTitle';
import SubNavbar from './SubNavbar';

export interface BreadcrumbItem {
  name: string;
  path?: string;
}

interface PageLayoutProps {
  title?: string;
  subtitle?: string;
  breadcrumb?: BreadcrumbItem[];
  titleSize: 'xl' | 'lg';
  titleMargin?: string;
  padding?: 'default' | 'none' | 'noTop' | 'noBottom';
  subNav?: SubNavConfig;
  pageTitle?: string; // <title> 및 og:title용
  pageDescription?: string; // meta description 및 og:description용
  noImageIndex?: boolean; // 이미지 검색 차단용
  children: ReactNode;
}

/**
 * 본문 기본 스타일
 * padding-left: 100px
 * padding-right: 360px
 * padding-top: 44px
 * padding-bottom: 150px
 * background-color: white
 */
export default function PageLayout({
  title,
  subtitle,
  breadcrumb,
  titleSize,
  titleMargin = 'mb-6 sm:mb-11',
  padding = 'default',
  subNav,
  pageTitle,
  pageDescription,
  noImageIndex,
  children,
}: PageLayoutProps) {
  const generatedBreadcrumb = useBreadcrumb();
  const finalBreadcrumb = breadcrumb ?? generatedBreadcrumb;
  const { locale } = useLanguage();

  // pageTitle에 자동으로 SITE_NAME 추가
  const fullPageTitle = pageTitle
    ? `${pageTitle} | ${locale === 'en' ? SITE_NAME.en : SITE_NAME.ko}`
    : undefined;

  const paddingClass =
    padding === 'none'
      ? 'p-0'
      : padding === 'noTop'
        ? 'p-[0_1.25rem_4rem_1.25rem] sm:p-[0_360px_150px_100px]'
        : padding === 'noBottom'
          ? 'p-[1.75rem_1.25rem_0_1.25rem] sm:p-[2.75rem_360px_0_100px]'
          : 'p-[1.75rem_1.25rem_4rem_1.25rem] sm:p-[2.75rem_360px_150px_100px]';

  return (
    <>
      {/* React 19 메타데이터 */}
      {fullPageTitle && (
        <>
          <title>{fullPageTitle}</title>
          <meta property="og:title" content={fullPageTitle} />
        </>
      )}
      {pageDescription && (
        <>
          <meta name="description" content={pageDescription} />
          <meta property="og:description" content={pageDescription} />
        </>
      )}
      {noImageIndex && <meta name="robots" content="noimageindex" />}

      {/* 기존 레이아웃 */}
      <div className="flex grow flex-col bg-neutral-900">
        <Header />
        {(title || finalBreadcrumb.length > 0) && (
          <PageTitle
            title={title}
            subtitle={subtitle}
            breadcrumb={finalBreadcrumb}
            titleSize={titleSize}
            margin={titleMargin}
          />
        )}
        <div className={`relative grow bg-white ${paddingClass}`}>
          {children}
          {subNav && <SubNavbar {...subNav} />}
        </div>
      </div>
    </>
  );
}
