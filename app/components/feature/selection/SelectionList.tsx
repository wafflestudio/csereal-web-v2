import { Link } from 'react-router';
import CornerFoldedRectangle from '~/components/ui/CornerFoldedRectangle';
import type { SelectionListItem } from '~/hooks/useSelectionList';

interface SelectionListProps {
  items: SelectionListItem[];
}

export default function SelectionList({ items }: SelectionListProps) {
  return (
    <ul className="mb-6 grid grid-cols-2 gap-3 pt-7 sm:mb-9 sm:pt-11 lg:grid-cols-[repeat(auto-fit,minmax(236px,auto))]">
      {items.map((item) => (
        <SelectionItem
          key={item.id}
          href={item.href}
          name={item.label}
          isSelected={Boolean(item.selected)}
        />
      ))}
    </ul>
  );
}

interface SelectionItemProps {
  name: string;
  isSelected: boolean;
  href: string;
}

function SelectionItem({ name, isSelected, href }: SelectionItemProps) {
  const itemCommonStyle =
    'flex items-center justify-center w-full h-10 py-3 text-center text-[11px] sm:text-sm lg:text-md tracking-wide';

  return (
    <li>
      {isSelected ? (
        <CornerFoldedRectangle
          colorTheme="orange"
          size="small"
          shadow="medium"
          width="w-full"
        >
          <span className={`${itemCommonStyle} font-medium text-neutral-50`}>
            {name}
          </span>
        </CornerFoldedRectangle>
      ) : (
        <CornerFoldedRectangle
          colorTheme="lightGray"
          size="small"
          shadow="medium"
          animationType="folding"
          width="w-full"
        >
          <Link
            to={href}
            preventScrollReset
            className={`${itemCommonStyle} text-neutral-500 transition-all duration-300 hover:text-neutral-800`}
          >
            {name}
          </Link>
        </CornerFoldedRectangle>
      )}
    </li>
  );
}
