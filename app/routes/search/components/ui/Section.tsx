import type { ReactNode } from 'react';
import { useLanguage } from '~/hooks/useLanguage';

type TranslationKey = keyof typeof import('~/translations.json');

export default function Section({
  title,
  size,
  sectionId,
  children,
}: {
  title: TranslationKey;
  size: number;
  sectionId: string;
  children: ReactNode;
}) {
  const { t } = useLanguage();
  if (size === 0) return null;

  return (
    <div className="flex flex-col" id={`nav_${sectionId}`}>
      <div className="mb-8 flex">
        <h3 className="inline border-b-2 border-neutral-200 px-2.5 pb-2 text-[1.25rem] font-semibold leading-loose text-neutral-950">
          {t(title)}({size})
        </h3>
        <div className="flex h-5 self-end">
          <div className="w-[1.7rem] origin-bottom-left -rotate-45 self-end border-b-2 border-neutral-200" />
          <div className="w-40 translate-x-[-0.6rem] self-start border-t-2 border-neutral-200" />
        </div>
      </div>
      {children}
    </div>
  );
}
