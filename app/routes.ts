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
      route('/contact', 'routes/about/contact.tsx'),
      route('/directions', 'routes/about/directions/index.tsx'),
    ]),
    ...prefix('/community', [
      route('/', 'routes/community/index.tsx'),
      route('/notice', 'routes/community/notice/index.tsx'),
      route('/notice/:id', 'routes/community/notice/$id.tsx'),
      route('/news', 'routes/community/news/index.tsx'),
      route('/news/:id', 'routes/community/news/$id.tsx'),
      route('/seminar', 'routes/community/seminar/index.tsx'),
      route('/seminar/:id', 'routes/community/seminar/$id.tsx'),
      route('/faculty-recruitment', 'routes/community/faculty-recruitment.tsx'),
    ]),
    ...prefix('/people', [
      route('/', 'routes/people/index.tsx'),
      route('/faculty', 'routes/people/faculty/index.tsx'),
      route('/faculty/:id', 'routes/people/faculty/$id.tsx'),
      route('/emeritus-faculty', 'routes/people/emeritus-faculty/index.tsx'),
      route('/emeritus-faculty/:id', 'routes/people/emeritus-faculty/$id.tsx'),
      route('/staff', 'routes/people/staff/index.tsx'),
      route('/staff/:id', 'routes/people/staff/$id.tsx'),
    ]),
    ...prefix('/research', [
      route('/', 'routes/research/index.tsx'),
      route('/groups', 'routes/research/groups/index.tsx'),
      route('/centers', 'routes/research/centers/index.tsx'),
      route('/labs', 'routes/research/labs/index.tsx'),
      route('/labs/:id', 'routes/research/labs/$id.tsx'),
      route(
        '/top-conference-list',
        'routes/research/top-conference-list/index.tsx',
      ),
    ]),
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
    ...prefix('/academics', [
      route('/', 'routes/academics/index.tsx'),
      ...prefix('/undergraduate', [
        route('/guide', 'routes/academics/undergraduate/guide.tsx'),
        route('/courses', 'routes/academics/undergraduate/courses.tsx'),
        route('/curriculum', 'routes/academics/undergraduate/curriculum.tsx'),
        route(
          '/general-studies-requirements',
          'routes/academics/undergraduate/general-studies-requirements.tsx',
        ),
        route(
          '/degree-requirements',
          'routes/academics/undergraduate/degree-requirements.tsx',
        ),
        route(
          '/course-changes',
          'routes/academics/undergraduate/course-changes.tsx',
        ),
        route(
          '/scholarship',
          'routes/academics/undergraduate/scholarship/index.tsx',
        ),
        route(
          '/scholarship/:id',
          'routes/academics/undergraduate/scholarship/$id.tsx',
        ),
      ]),
      ...prefix('/graduate', [
        route('/guide', 'routes/academics/graduate/guide.tsx'),
        route('/courses', 'routes/academics/graduate/courses.tsx'),
        route(
          '/course-changes',
          'routes/academics/graduate/course-changes.tsx',
        ),
        route(
          '/scholarship',
          'routes/academics/graduate/scholarship/index.tsx',
        ),
        route(
          '/scholarship/:id',
          'routes/academics/graduate/scholarship/$id.tsx',
        ),
      ]),
    ]),
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
