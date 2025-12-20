import LinkRow from '~/components/common/LinkRow';
import { useLanguage } from '~/hooks/useLanguage';

export default function LinkSection() {
  const { t, localizedPath } = useLanguage();

  return (
    <div className="mx-6 mb-28 mt-[60px] flex flex-col gap-16 sm:mx-[7.81rem] sm:mb-48 sm:mt-[90px] sm:flex-row sm:gap-32">
      <div className="flex flex-1 flex-col gap-[1.37rem] sm:gap-9">
        <h3 className="text-md font-medium text-neutral-400 sm:text-[1.3125rem]">
          {t('바로가기')}
        </h3>
        <div className="flex flex-col gap-5">
          <LinkRow
            to={localizedPath('/community/top-conference')}
            title="Top Conference List"
          />
          <LinkRow
            to={localizedPath('/about/faculty-recruitment')}
            title="신임교수초빙"
            subtitle="Faculty Recruitment"
          />
          <LinkRow
            to={localizedPath('/people/faculty')}
            title="구성원"
            subtitle="Faculty"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-[1.37rem] sm:gap-9">
        <h3 className="text-md font-medium text-neutral-400 sm:text-[1.3125rem]">
          {t('학부')}
        </h3>
        <div className="flex flex-col gap-5">
          <LinkRow
            to={localizedPath('/academics/undergraduate/general-studies')}
            title="필수 교양 과목"
            subtitle="General Studies Requirements"
          />
          <LinkRow
            to={localizedPath('/academics/undergraduate/degree-requirements')}
            title="졸업 규정"
            subtitle="Degree Requirements"
          />
        </div>
      </div>
    </div>
  );
}
