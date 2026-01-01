import Image from '~/components/ui/Image';

export default function ProfileImage({
  imageURL,
  alt = '대표 이미지',
}: {
  imageURL: string | null;
  alt?: string;
}) {
  return (
    <Image
      alt={alt}
      src={imageURL}
      width={200}
      height={264}
      className="object-contain drop-shadow-[0px_0px_4px_rgba(0,0,0,0.15)]"
      loading="lazy"
      quality={100}
    />
  );
}
