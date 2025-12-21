import clsx from 'clsx';
import { useNavigate, useSearchParams } from 'react-router';
import Node from '~/components/common/Nodes';
import Input from './Input';
import SelectedTags from './SelectedTags';
import TagCheckBoxes from './TagCheckboxes';

interface SearchBoxProps {
  tags: string[];
  disabled?: boolean;
  formOnly?: boolean;
}

export default function SearchBox({
  tags,
  disabled = false,
  formOnly = false,
}: SearchBoxProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedTags = searchParams.getAll('tag');
  const initialKeyword = searchParams.get('keyword') ?? '';

  const handleSearch = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    const keyword = String(formData.get('keyword') ?? '').trim();

    const newParams = new URLSearchParams();
    newParams.set('keyword', keyword);
    for (const tag of selectedTags) {
      newParams.append('tag', tag);
    }

    navigate({ search: newParams.toString() });
  };

  return (
    <div className={clsx('mb-9 w-full', disabled && 'opacity-30')}>
      <form
        className={clsx(
          'flex flex-col gap-5 rounded-sm bg-neutral-50 p-6',
          !formOnly && 'mb-9',
        )}
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(e.currentTarget);
        }}
      >
        <TagCheckBoxes
          tags={tags}
          selectedTags={selectedTags}
          disabled={disabled}
        />
        <Input
          key={initialKeyword}
          defaultValue={initialKeyword}
          disabled={disabled}
        />
      </form>

      {!formOnly && (
        <>
          <div className="mb-3 mt-9">
            <Node variant="straightDouble" tone="brand" direction="row" />
          </div>
          <SelectedTags tags={selectedTags} disabled={disabled} />
        </>
      )}
    </div>
  );
}
