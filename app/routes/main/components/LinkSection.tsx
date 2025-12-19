import { Link } from 'react-router';
import { useLanguage } from '~/hooks/useLanguage';

export default function LinkSection() {
  const { t, localizedPath } = useLanguage({
    바로가기: 'Quick Links',
    학부: 'Undergraduate',
  });

  return (
    <div className="mx-6 mb-[7rem] mt-[60px] flex flex-col gap-[4rem] sm:mx-[7.81rem] sm:mb-[12rem] sm:mt-[90px] sm:flex-row sm:gap-[8rem]">
      <div className="flex flex-1 flex-col gap-[1.37rem] sm:gap-9">
        <h3 className="text-md font-medium text-neutral-400 sm:text-[1.3125rem]">
          {t('바로가기')}
        </h3>
        <div className="flex flex-col gap-5">
          <LinkWithArrow
            href={localizedPath('/community/top-conference')}
            title="Top Conference List"
          />
          <LinkWithArrow
            href={localizedPath('/about/faculty-recruitment')}
            title="신임교수초빙"
            subtitle="Faculty Recruitment"
          />
          <LinkWithArrow
            href={localizedPath('/people/faculty')}
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
          <LinkWithArrow
            href={localizedPath('/academics/undergraduate/general-studies')}
            title="필수 교양 과목"
            subtitle="General Studies Requirements"
          />
          <LinkWithArrow
            href={localizedPath('/academics/undergraduate/degree-requirements')}
            title="졸업 규정"
            subtitle="Degree Requirements"
          />
        </div>
      </div>
    </div>
  );
}

const LinkWithArrow = ({
  href,
  title,
  subtitle,
}: {
  href: string;
  title: string;
  subtitle?: string;
}) => {
  return (
    <Link
      to={href}
      className="group flex h-10 items-center justify-between border-l-[5px] border-[#E65817] pl-7 duration-300"
    >
      <div className="flex items-end gap-3 text-white group-hover:text-main-orange">
        <p className="text-base font-medium sm:text-lg sm:font-semibold">
          {title}
        </p>
        <p className="text-xs font-medium sm:font-semibold">{subtitle}</p>
      </div>
      <span className="material-symbols-outlined pt-0.5 text-[30px] font-extralight text-white duration-300 group-hover:translate-x-[10px] group-hover:font-light group-hover:text-main-orange">
        arrow_forward
      </span>
    </Link>
  );
};
