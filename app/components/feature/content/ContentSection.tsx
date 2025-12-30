import clsx from 'clsx';
import type { ReactNode } from 'react';

type Tone = 'white' | 'neutral';
type Padding = 'default' | 'subNav' | 'overviewTop' | 'overviewBottom';

interface ContentSectionProps {
  tone: Tone;
  padding: Padding;
  children: ReactNode;
}

const TONE_CLASSES: Record<Tone, string> = {
  white: 'bg-white',
  neutral: 'bg-neutral-100',
};

const PADDING_CLASSES: Record<Padding, string> = {
  default: 'px-5 pb-12 pt-7 sm:py-11 sm:pl-25 sm:pr-90',
  subNav: 'px-5 pb-12 pt-7 sm:pt-11 sm:pb-[150px] sm:pl-25 sm:pr-[360px]',
  overviewTop: 'px-5 pb-12 pt-7 sm:py-11 sm:pl-25 sm:pr-90',
  overviewBottom: 'px-5 pb-16 pt-10 sm:pb-[7.88rem] sm:pl-25 sm:pr-90',
};

export default function ContentSection({
  tone,
  padding,
  children,
}: ContentSectionProps) {
  return (
    <section className={clsx(TONE_CLASSES[tone], PADDING_CLASSES[padding])}>
      {children}
    </section>
  );
}
