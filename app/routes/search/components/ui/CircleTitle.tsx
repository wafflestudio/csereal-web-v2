import { useLanguage } from '~/hooks/useLanguage';

export default function CircleTitle({
  title,
  size,
}: {
  title: string;
  size?: number;
}) {
  const { tUnsafe } = useLanguage();
  return (
    <div className="ml-[0.8rem] flex items-center gap-2">
      <div className="h-[.625rem] w-[.625rem] rounded-full border border-main-orange" />
      <h3 className="text-[1.0625rem] font-semibold leading-loose text-neutral-950">
        {tUnsafe(title)}
        {size ? `(${size})` : ''}
      </h3>
    </div>
  );
}
