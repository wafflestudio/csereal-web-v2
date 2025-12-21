interface PeopleProfileInfoItem {
  icon: string;
  label?: string | null;
  href?: string | null;
}

interface PeopleProfileInfoProps {
  imageURL: string | null;
  items: PeopleProfileInfoItem[];
}

export default function PeopleProfileInfo({
  imageURL,
  items,
}: PeopleProfileInfoProps) {
  return (
    <div className="relative mb-8 sm:float-right">
      <ProfileImage imageURL={imageURL} />

      <div className="mt-5 flex flex-col gap-[9px] bg-white text-sm font-medium text-neutral-600">
        {items.map((item, idx) => (
          <ProfileInfoRow key={`${item.icon}-${idx}`} {...item} />
        ))}
      </div>
    </div>
  );
}

function ProfileImage({
  imageURL,
  alt = '대표 이미지',
}: {
  imageURL: string | null;
  alt?: string;
}) {
  const style = {
    clipPath: 'polygon(84.375% 0%, 100% 11.71875%, 100% 100%, 0% 100%, 0% 0%)',
    filter: 'drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.15))',
  };

  if (!imageURL) {
    return <div className="h-[264px] w-[200px] bg-neutral-200" style={style} />;
  }

  return (
    <img
      alt={alt}
      src={imageURL}
      width={200}
      height={264}
      className="h-[264px] w-[200px] object-contain"
      style={style}
      loading="lazy"
    />
  );
}

function ProfileInfoRow({ icon, label, href }: PeopleProfileInfoItem) {
  const hasLabel = typeof label === 'string' && label.length > 0;

  return (
    <div className="flex items-center gap-[6px] break-all">
      <span className="material-symbols-rounded text-[20px] font-light">
        {icon}
      </span>
      {href ? (
        <a
          target={href.startsWith('http') ? '_blank' : undefined}
          href={href}
          className="text-link hover:underline"
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {label}
        </a>
      ) : (
        <p>{hasLabel ? label : '-'}</p>
      )}
    </div>
  );
}
