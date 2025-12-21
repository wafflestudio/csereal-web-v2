import BulletRow from './PeopleBulletRow';

interface ContactItem {
  label: string;
  value?: string;
  href?: string;
}

interface PeopleContactListProps {
  title: string;
  items: ContactItem[];
}

export default function PeopleContactList({
  title,
  items,
}: PeopleContactListProps) {
  if (items.length === 0) return null;

  return (
    <article className="mb-6 flex flex-col text-neutral-700">
      <h3 className="text-base font-bold leading-8">{title}</h3>
      <ul className="list-inside list-disc">
        {items.map((item) => (
          <BulletRow key={item.label}>
            {item.label}:{' '}
            {item.href ? (
              <a className="ml-1 text-link hover:underline" href={item.href}>
                {item.value}
              </a>
            ) : (
              item.value
            )}
          </BulletRow>
        ))}
      </ul>
    </article>
  );
}
