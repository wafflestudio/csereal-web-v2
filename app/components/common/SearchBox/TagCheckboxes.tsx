import { useNavigate, useSearchParams } from 'react-router';
import Checkbox from '~/components/common/Checkbox';
import { useLanguage } from '~/hooks/useLanguage';

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  disabled: boolean;
}

export default function TagCheckBoxes({
  tags,
  selectedTags,
  disabled,
}: TagFilterProps) {
  const { t, tUnsafe, locale } = useLanguage({ 태그: 'Tags' });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const toggleCheck = (tag: string, isChecked: boolean) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('tag');
    newParams.delete('pageNum');

    const newTags = isChecked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);

    for (const t of newTags) {
      newParams.append('tag', t);
    }

    navigate({ search: newParams.toString() }, { preventScrollReset: true });
  };

  const words = tags.map((tag) => tUnsafe(tag));
  const widthPerLetter = locale === 'ko' ? 12 : 7;
  const longestLength = Math.max(...words.map((word) => word.length));
  const width = widthPerLetter * longestLength;

  return (
    <div>
      <h5 className="mb-3 mr-6 whitespace-nowrap text-md font-bold tracking-wide">
        {t('태그')}
      </h5>
      <div
        className="grid gap-x-7 gap-y-2.5 pl-2.5"
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${width}px, auto))`,
        }}
      >
        {tags.map((tag) => (
          <Checkbox
            key={tag}
            label={tUnsafe(tag)}
            checked={selectedTags.includes(tag)}
            name="tag"
            value={tag}
            onChange={(checked) => toggleCheck(tag, checked)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}
