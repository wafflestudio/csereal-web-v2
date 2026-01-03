import type { Route } from '.react-router/types/app/routes/+types/lang';
import { data } from 'react-router';
import type { Locale } from '~/types/i18n';
import { getLangCookieHeader } from '~/utils/lang';

// 언어 설정 쿠키를 서버에서 설정
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const lang = formData.get('lang') as Locale | null;

  if (lang === 'ko' || lang === 'en') {
    return data(
      { ok: true },
      { headers: { 'Set-Cookie': getLangCookieHeader(lang) } },
    );
  }

  return data({ ok: false }, { status: 400 });
}
