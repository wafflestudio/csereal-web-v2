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
    route('/search', 'routes/search/index.tsx'),
    ...prefix('/about', [
      route('/', 'routes/about/index.tsx'),
      route('/overview', 'routes/about/overview/index.tsx'),
      route('/overview/edit', 'routes/about/overview/edit.tsx'),
      route('/greetings', 'routes/about/greetings.tsx'),
      route('/history', 'routes/about/history.tsx'),
      route('/future-careers', 'routes/about/future-careers/index.tsx'),
      route(
        '/future-careers/description/edit',
        'routes/about/future-careers/description/edit.tsx',
      ),
      route(
        '/future-careers/stat/edit',
        'routes/about/future-careers/stat/edit.tsx',
      ),
      route(
        '/future-careers/stat/create',
        'routes/about/future-careers/stat/create.tsx',
      ),
      route('/student-clubs', 'routes/about/student-clubs/index.tsx'),
      route('/student-clubs/create', 'routes/about/student-clubs/create.tsx'),
      route('/student-clubs/edit', 'routes/about/student-clubs/edit.tsx'),
      route('/facilities', 'routes/about/facilities/index.tsx'),
      route('/facilities/create', 'routes/about/facilities/create.tsx'),
      route('/facilities/edit', 'routes/about/facilities/edit.tsx'),
      route('/contact', 'routes/about/contact.tsx'),
      route('/directions', 'routes/about/directions/index.tsx'),
      route('/directions/:id/edit', 'routes/about/directions/$id/edit.tsx'),
      // Dynamic route for overview/greetings/history/contact edit pages
      route('/:type/edit', 'routes/about/$type/edit.tsx'),
    ]),
    ...prefix('/community', [
      route('/', 'routes/community/index.tsx'),
      route('/notice', 'routes/community/notice/index.tsx'),
      route('/notice/create', 'routes/community/notice/create.tsx'),
      route('/notice/edit/:id', 'routes/community/notice/edit.$id.tsx'),
      route('/notice/:id', 'routes/community/notice/$id.tsx'),
      route('/news', 'routes/community/news/index.tsx'),
      route('/news/create', 'routes/community/news/create.tsx'),
      route('/news/edit/:id', 'routes/community/news/edit.$id.tsx'),
      route('/news/:id', 'routes/community/news/$id.tsx'),
      route('/seminar', 'routes/community/seminar/index.tsx'),
      route('/seminar/create', 'routes/community/seminar/create.tsx'),
      route('/seminar/edit/:id', 'routes/community/seminar/edit.$id.tsx'),
      route('/seminar/:id', 'routes/community/seminar/$id.tsx'),
      route(
        '/faculty-recruitment',
        'routes/community/faculty-recruitment/index.tsx',
      ),
      route(
        '/faculty-recruitment/edit',
        'routes/community/faculty-recruitment/edit.tsx',
      ),
    ]),
    ...prefix('/people', [
      route('/', 'routes/people/index.tsx'),
      route('/faculty', 'routes/people/faculty/index.tsx'),
      route('/faculty/create', 'routes/people/faculty/create.tsx'),
      route('/faculty/:id/edit', 'routes/people/faculty/edit.$id.tsx'),
      route('/faculty/:id', 'routes/people/faculty/$id.tsx'),
      route('/emeritus-faculty', 'routes/people/emeritus-faculty/index.tsx'),
      route(
        '/emeritus-faculty/:id/edit',
        'routes/people/emeritus-faculty/edit.$id.tsx',
      ),
      route('/emeritus-faculty/:id', 'routes/people/emeritus-faculty/$id.tsx'),
      route('/staff', 'routes/people/staff/index.tsx'),
      route('/staff/create', 'routes/people/staff/create.tsx'),
      route('/staff/:id/edit', 'routes/people/staff/edit.$id.tsx'),
      route('/staff/:id', 'routes/people/staff/$id.tsx'),
    ]),
    ...prefix('/research', [
      route('/', 'routes/research/index.tsx'),
      route('/groups', 'routes/research/groups/index.tsx'),
      route('/groups/create', 'routes/research/groups/create.tsx'),
      route('/groups/:id/edit', 'routes/research/groups/$id/edit.tsx'),
      route('/centers', 'routes/research/centers/index.tsx'),
      route('/centers/create', 'routes/research/centers/create.tsx'),
      route('/centers/:id/edit', 'routes/research/centers/$id/edit.tsx'),
      route('/labs', 'routes/research/labs/index.tsx'),
      route('/labs/create', 'routes/research/labs/create.tsx'),
      route('/labs/:id/edit', 'routes/research/labs/$id/edit.tsx'),
      route('/labs/:id', 'routes/research/labs/$id/index.tsx'),
      route(
        '/top-conference-list',
        'routes/research/top-conference-list/index.tsx',
      ),
    ]),
    ...prefix('/admissions', [
      route('/', 'routes/admissions/index.tsx'),
      // Dynamic route for all admissions display pages
      route(
        '/:mainType/:postType',
        'routes/admissions/$mainType/$postType/index.tsx',
      ),
      // Dynamic route for all admissions edit pages
      route(
        '/:mainType/:postType/edit',
        'routes/admissions/$mainType/$postType/edit.tsx',
      ),
    ]),
    ...prefix('/academics', [
      route('/', 'routes/academics/index.tsx'),
      ...prefix('/undergraduate', [
        route(
          '/curriculum',
          'routes/academics/undergraduate/curriculum/index.tsx',
        ),
        route(
          '/curriculum/create',
          'routes/academics/undergraduate/curriculum/create.tsx',
        ),
        route(
          '/curriculum/edit/:year',
          'routes/academics/undergraduate/curriculum/edit.$year.tsx',
        ),
        route(
          '/general-studies-requirements',
          'routes/academics/undergraduate/general-studies-requirements/index.tsx',
        ),
        route(
          '/general-studies-requirements/create',
          'routes/academics/undergraduate/general-studies-requirements/create.tsx',
        ),
        route(
          '/general-studies-requirements/edit/:year',
          'routes/academics/undergraduate/general-studies-requirements/edit.$year.tsx',
        ),
        route(
          '/degree-requirements',
          'routes/academics/undergraduate/degree-requirements/index.tsx',
        ),
        route(
          '/degree-requirements/edit',
          'routes/academics/undergraduate/degree-requirements/edit.tsx',
        ),
      ]),
      // Dynamic routes for courses, guide, course-changes, scholarship (must be after specific routes)
      route(
        '/:studentType/courses',
        'routes/academics/$studentType/courses.tsx',
      ),
      route(
        '/:studentType/guide',
        'routes/academics/$studentType/guide/index.tsx',
      ),
      route(
        '/:studentType/guide/edit',
        'routes/academics/$studentType/guide/edit.tsx',
      ),
      route(
        '/:studentType/course-changes',
        'routes/academics/$studentType/course-changes.tsx',
      ),
      route(
        '/:studentType/course-changes/create',
        'routes/academics/$studentType/course-changes/create.tsx',
      ),
      route(
        '/:studentType/course-changes/edit/:year',
        'routes/academics/$studentType/course-changes/edit/$year.tsx',
      ),
      // Dynamic routes for scholarship (must be after specific routes)
      route(
        '/:studentType/scholarship',
        'routes/academics/$studentType/scholarship/index.tsx',
      ),
      route(
        '/:studentType/scholarship/edit',
        'routes/academics/$studentType/scholarship/edit.tsx',
      ),
      route(
        '/:studentType/scholarship/create',
        'routes/academics/$studentType/scholarship/create.tsx',
      ),
      route(
        '/:studentType/scholarship/:id/edit',
        'routes/academics/$studentType/scholarship/$id/edit.tsx',
      ),
      route(
        '/:studentType/scholarship/:id',
        'routes/academics/$studentType/scholarship/$id/index.tsx',
      ),
    ]),
    ...prefix('/reservations', [
      route('/', 'routes/reservations/index.tsx'),
      route('/introduction', 'routes/reservations/introduction.tsx'),
      route('/privacy-policy', 'routes/reservations/privacy-policy.tsx'),
      route(
        '/:roomType/:roomName',
        'routes/reservations/$roomType/$roomName.tsx',
      ),
    ]),
    route('/10-10-project', 'routes/10-10-project/index.tsx'),
    route('/10-10-project/proposal', 'routes/10-10-project/proposal.tsx'),
    route('/10-10-project/manager', 'routes/10-10-project/manager.tsx'),
    route(
      '/10-10-project/participants',
      'routes/10-10-project/participants.tsx',
    ),
    route('*', 'routes/404.tsx'),
  ];
};

export default [
  layout('routes/layout.tsx', [
    _route('/img', 'routes/img.tsx'),
    ...getLocaleRoutes('ko'),
    ...prefix('/en', [...getLocaleRoutes('en')]),
    _route('/admin', 'routes/admin/index.tsx'),
    _route('/.internal', 'routes/internal.tsx'),
  ]),
] satisfies RouteConfig;
