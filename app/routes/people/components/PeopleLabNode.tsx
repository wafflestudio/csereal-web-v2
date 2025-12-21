import { Link } from 'react-router';
import Node from '~/components/common/Nodes';
import { useLanguage } from '~/hooks/useLanguage';
import type { Faculty } from '~/types/api/v2/professor';

export default function PeopleLabNode({ faculty }: { faculty: Faculty }) {
  const { localizedPath } = useLanguage();

  if (!faculty.labId || !faculty.labName) return null;

  return (
    <div className="flex">
      <Node variant="curvedHorizontalSmall" />
      <div className="-translate-x-[7.15px] translate-y-[4px] border-b border-b-main-orange pb-[5px] pr-2">
        <Link
          to={localizedPath(`/research/labs/${faculty.labId}`)}
          className="text-sm font-medium leading-5 text-neutral-700 hover:text-main-orange"
        >
          {faculty.labName}
        </Link>
      </div>
    </div>
  );
}
