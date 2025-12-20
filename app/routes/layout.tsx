import type { Route } from '.react-router/types/app/routes/+types/layout';
import { useEffect } from 'react';
import { isRouteErrorResponse, Outlet, useNavigate } from 'react-router';
import ErrorState from '~/components/common/ErrorState';
import Header from '~/components/layout/Header';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { type Role, useStore } from '~/store';

export async function loader({
  request,
}: Route.LoaderArgs): Promise<Role | undefined> {
  try {
    const response = await fetch(`${BASE_URL}/v2/user/my-role`, {
      headers: request.headers,
    });
    if (!response.ok) return undefined;

    const { roles }: { roles: Role[] } = await response.json();

    // 우선순위 체크
    if (roles.includes('ROLE_STAFF')) return 'ROLE_STAFF';
    if (roles.includes('ROLE_RESERVATION')) return 'ROLE_RESERVATION';
    if (roles.includes('ROLE_COUNCIL')) return 'ROLE_COUNCIL';

    return undefined;
  } catch {
    return undefined;
  }
}

export default function Layout({ loaderData }: Route.ComponentProps) {
  useEffect(() => {
    useStore.setState({ role: loaderData });
  }, [loaderData]);

  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = useLanguage({ '메인으로 이동': 'Go to home' });
  const navigate = useNavigate();

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Unknown error';

  return (
    <>
      <Header />
      <ErrorState
        message={`Error: ${message}`}
        action={{ label: t('메인으로 이동'), onClick: () => navigate('/') }}
      />
    </>
  );
}
