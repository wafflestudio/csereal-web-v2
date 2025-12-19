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
    ...prefix('/about', [route('/overview', 'routes/about/overview.tsx')]),
  ];
};

export default [
  layout('routes/layout.tsx', [
    ...getLocaleRoutes('ko'),
    ...prefix('/en', [...getLocaleRoutes('en')]),
  ]),
] satisfies RouteConfig;
