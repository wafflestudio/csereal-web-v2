import { Link } from 'react-router';
import Image from '~/components/ui/Image';
import { useLanguage } from '~/hooks/useLanguage';
import type { Member, MemberSearchResult } from '~/types/api/v2/search';
import styles from '../../style.module.css';
import CircleTitle from '../ui/CircleTitle';
import Section from '../ui/Section';

export default function MemberSection({
  member,
}: {
  member: MemberSearchResult;
}) {
  const professorList = member.results.filter(
    (item) => item.memberType === 'PROFESSOR',
  );
  const staffList = member.results.filter(
    (item) => item.memberType === 'STAFF',
  );

  return (
    <Section title="구성원" size={member.total} sectionId="member">
      {professorList.length !== 0 && (
        <>
          <CircleTitle title="교수진" />
          <div className="ml-5 mt-7 flex flex-wrap gap-10 sm:gap-12">
            {professorList.slice(0, 3).map((result) => (
              <MemberCell key={result.id} {...result} />
            ))}
          </div>
        </>
      )}
      {professorList.length !== 0 && staffList.length !== 0 && (
        <div className="my-10 border-b border-neutral-300" />
      )}
      {staffList.length !== 0 && (
        <>
          <CircleTitle title="행정직원" />
          <div className="ml-5 mt-7 flex flex-wrap gap-10 sm:gap-12">
            {staffList.slice(0, 3).map((result) => (
              <MemberCell key={result.id} {...result} />
            ))}
          </div>
        </>
      )}
    </Section>
  );
}

function MemberCell({
  name,
  academicRankOrRole,
  imageURL,
  memberType,
  id,
}: Member) {
  const { localizedPath } = useLanguage();
  const href =
    memberType === 'PROFESSOR'
      ? `/people/faculty/${id}`
      : `/people/staff/${id}`;

  return (
    <Link className="group flex flex-col gap-3" to={localizedPath(href)}>
      <Image
        src={imageURL ?? undefined}
        alt={`${name} 프로필`}
        className={`h-[192px] w-[144px] object-cover ${styles.memberImage}`}
        width={144}
        height={192}
      />
      <div className="flex items-end gap-1">
        <h3 className="text-[1.04169rem] font-bold text-neutral-950 group-hover:underline">
          {name}
        </h3>
        <p className="text-md font-normal text-neutral-500">
          {academicRankOrRole}
        </p>
      </div>
    </Link>
  );
}
