import clsx from 'clsx';
import Node from '~/components/ui/Nodes';
import { useLanguage } from '~/hooks/useLanguage';

type TranslationKey = keyof typeof import('~/translations.json');

export type TreeNode = {
  id: string;
  name: TranslationKey;
  size?: number;
  children?: TreeNode[];
  bold?: boolean;
};

export default function SearchSubNavbar({ node }: { node: TreeNode[] }) {
  const { t } = useLanguage();

  return (
    <div className="absolute right-[80px] top-0 hidden h-full sm:block">
      <div className="sticky top-[52px] mb-8 mt-13 flex">
        <div>
          <Node variant="curvedVertical" tone="brand" grow />
        </div>
        <div className="pl-1.5 pt-2.75">
          <h3 className="mb-4 text-base font-semibold text-neutral-800">
            {t('통합검색')}
          </h3>
          <ul className="flex flex-col gap-[0.87rem]">
            {node.map((childNode) => (
              <SubTab node={childNode} key={childNode.id} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function SubTab({ node }: { node: TreeNode }) {
  return (
    <>
      <NavbarButton node={node} className="ml-[16px]" />
      {node.children?.map((childNode) => (
        <NavbarButton
          node={childNode}
          key={childNode.id}
          className="ml-[32px]"
        />
      ))}
    </>
  );
}

function NavbarButton({
  node,
  className,
}: {
  node: TreeNode;
  className: string;
}) {
  const { t } = useLanguage();
  const isDisabled = node.size === undefined || node.size === 0;

  return (
    <button
      type="button"
      onClick={() => scrollToSection(`nav_${node.id}`)}
      className={clsx(
        'block text-left text-sm',
        node.bold ? 'font-bold text-main-orange' : 'text-neutral-700',
        isDisabled && 'pointer-events-none',
        className,
      )}
    >
      {t(node.name)}
      {node.size !== undefined && `(${node.size})`}
    </button>
  );
}

const scrollToSection = (id: string) => {
  const target = document.getElementById(id);
  if (!target) return;

  const pos = target.getBoundingClientRect();
  window.scrollTo({ top: pos.top + window.scrollY - 100, behavior: 'smooth' });
};
