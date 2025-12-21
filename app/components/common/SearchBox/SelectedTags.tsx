import { useNavigate, useSearchParams } from 'react-router';
import { Tag } from '~/components/common/Tag';
import { useLanguage } from '~/hooks/useLanguage';

interface SelectedTagsProps {
  tags: string[];
  disabled: boolean;
}

export default function SelectedTags({ tags, disabled }: SelectedTagsProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isTagExist = tags.length > 0;
  const { tUnsafe } = useLanguage();

  const deleteTag = (targetTag: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('tag');
    newParams.delete('pageNum');

    const filteredTags = tags.filter((tag) => tag !== targetTag);
    for (const tag of filteredTags) {
      newParams.append('tag', tag);
    }

    navigate({ search: newParams.toString() }, { preventScrollReset: true });
  };

  const resetTags = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('tag');
    newParams.delete('pageNum');
    navigate({ search: newParams.toString() }, { preventScrollReset: true });
  };

  return (
    <div className="flex items-start justify-between gap-3 px-2.5">
      <div className="flex flex-wrap items-center gap-2.5">
        {(isTagExist ? tags : ['전체']).map((tag) => (
          <Tag
            key={tag}
            label={tUnsafe(tag)}
            onDelete={isTagExist ? () => deleteTag(tag) : undefined}
            disabled={disabled}
          />
        ))}
      </div>
      {tags.length > 0 && (
        <TagResetButton onClick={resetTags} disabled={disabled} />
      )}
    </div>
  );
}

interface TagResetButtonProps {
  disabled: boolean;
  onClick: () => void;
}

function TagResetButton({ disabled, onClick }: TagResetButtonProps) {
  const { t } = useLanguage({ '태그 초기화': 'Reset Tags' });

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-0.5 text-main-orange enabled:hover:text-neutral-400"
      disabled={disabled}
    >
      <span className="material-symbols-outlined scale-x-[-1] text-base font-light">
        refresh
      </span>
      <span className="whitespace-nowrap text-md">{t('태그 초기화')}</span>
    </button>
  );
}
