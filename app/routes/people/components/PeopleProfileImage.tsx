import Image from '~/components/common/Image';

export default function ProfileImage({
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
    <Image
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
