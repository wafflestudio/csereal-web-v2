import Node from '~/components/common/Nodes';

interface SelectionTitleProps {
  title: string;
  subtitle?: string;
  animateKey?: string;
}

export default function SelectionTitle({
  title,
  subtitle,
  animateKey,
}: SelectionTitleProps) {
  return (
    <div className="mb-5 sm:w-fit" key={animateKey ?? title}>
      <h4 className="px-2.5 text-base font-bold leading-loose text-neutral-800 sm:text-[24px]">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold sm:text-[24px]">{title}</span>
          {subtitle && (
            <span className="pt-0.75 text-xs font-medium tracking-[0.02rem] sm:text-md">
              {subtitle}
            </span>
          )}
        </div>
      </h4>
      <div className="animate-stretch">
        <Node variant="straight" />
      </div>
    </div>
  );
}
