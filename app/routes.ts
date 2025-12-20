import {
  route as _route,
  layout,
  prefix,
  type RouteConfig,
} from '@react-router/dev/routes';
import type { Locale } from '~/types/i18n';

const routeFactory: (locale: Locale) => typeof _route =
  (locale) => (path, file, options) => {
    const id = file
      .replace(/^routes\//, '') // Remove 'routes/' prefix
      .replace(/\.tsx$/, '') // Remove '.tsx' extension
      .replace(/\//g, '-'); // Replace '/' with '-'

    return _route(path, file, { ...options, id: `${locale}-${id}` });
  };

const getLocaleRoutes = (locale: Locale) => {
  const route = routeFactory(locale);

  return [
    route('/', 'routes/main/index.tsx'),
    ...prefix('/about', [
      route('/', 'routes/about/index.tsx'),
      route('/overview', 'routes/about/overview.tsx'),
      route('/greetings', 'routes/about/greetings.tsx'),
      route('/history', 'routes/about/history.tsx'),
      route('/future-careers', 'routes/about/future-careers/index.tsx'),
      route('/student-clubs', 'routes/about/student-clubs/index.tsx'),
      route('/facilities', 'routes/about/facilities/index.tsx'),
    ]),
    ...prefix('/community', [route('/', 'routes/community/index.tsx')]),
    ...prefix('/people', [route('/', 'routes/people/index.tsx')]),
    ...prefix('/research', [route('/', 'routes/research/index.tsx')]),
    ...prefix('/admissions', [
      route('/', 'routes/admissions/index.tsx'),
      ...prefix('/undergraduate', [
        route(
          '/early-admission',
          'routes/admissions/undergraduate/early-admission.tsx',
        ),
        route(
          '/regular-admission',
          'routes/admissions/undergraduate/regular-admission.tsx',
        ),
      ]),
      ...prefix('/graduate', [
        route(
          '/regular-admission',
          'routes/admissions/graduate/regular-admission.tsx',
        ),
      ]),
      ...prefix('/international', [
        route(
          '/undergraduate',
          'routes/admissions/international/undergraduate.tsx',
        ),
        route('/graduate', 'routes/admissions/international/graduate.tsx'),
        route('/exchange', 'routes/admissions/international/exchange.tsx'),
        route(
          '/scholarships',
          'routes/admissions/international/scholarships.tsx',
        ),
      ]),
    ]),
    ...prefix('/academics', [route('/', 'routes/academics/index.tsx')]),
    ...prefix('/reservations', [route('/', 'routes/reservations/index.tsx')]),
    route('/10-10-project', 'routes/10-10-project/index.tsx'),
    route('*', 'routes/404.tsx'),
  ];
};

export default [
  layout('routes/layout.tsx', [
    ...getLocaleRoutes('ko'),
    ...prefix('/en', [...getLocaleRoutes('en')]),
  ]),
] satisfies RouteConfig;
