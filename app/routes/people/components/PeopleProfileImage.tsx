import Image from '~/components/ui/Image';

export default function ProfileImage({
  imageURL,
  alt = '대표 이미지',
}: {
  imageURL: string | null;
  alt?: string;
}) {
  const style = {
    // clipPath: 'polygon(84.375% 0%, 100% 11.71875%, 100% 100%, 0% 100%, 0% 0%)',
    filter: 'drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.15))',
  };

  return (
    <Image
      alt={alt}
      src={imageURL}
      width={200}
      height={264}
      className="object-contain"
      style={style}
      loading="lazy"
      quality={100}
    />
  );
}
