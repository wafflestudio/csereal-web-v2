import type { ReactNode } from 'react';

export default function PeopleBulletRow({ children }: { children: ReactNode }) {
  return (
    <li className="mr-px flex items-center space-x-2 px-2 text-sm font-normal leading-[26px]">
      <div className="h-[3px] w-[3px] rounded-full bg-neutral-950" />
      <p>{children}</p>
    </li>
  );
}
