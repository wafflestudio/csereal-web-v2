import { Link, useSearchParams } from 'react-router';
import Button from '~/components/common/Button';
import { useLanguage } from '~/hooks/useLanguage';

interface PostFooterProps {
  post: {
    nextId: number | null;
    nextTitle: string | null;
    prevId: number | null;
    prevTitle: string | null;
  };
  listPath: string;
}

export default function PostFooter({ post, listPath }: PostFooterProps) {
  const { t, localizedPath } = useLanguage({
    다음글: 'Next',
    이전글: 'Previous',
    목록: 'List',
  });
  const [searchParams] = useSearchParams();

  const nextPost =
    post.nextId && post.nextTitle
      ? { id: post.nextId, title: post.nextTitle }
      : null;
  const prevPost =
    post.prevId && post.prevTitle
      ? { id: post.prevId, title: post.prevTitle }
      : null;

  const pageNum = searchParams.get('pageNum');
  const listHref = pageNum
    ? `${localizedPath(listPath)}?pageNum=${pageNum}`
    : localizedPath(listPath);

  return (
    <div className="mt-12 flex flex-col">
      {nextPost && (
        <PostNavLink
          href={localizedPath(`${listPath}/${nextPost.id}`)}
          label={t('다음글')}
          title={nextPost.title}
          icon="expand_less"
        />
      )}

      {prevPost && (
        <PostNavLink
          href={localizedPath(`${listPath}/${prevPost.id}`)}
          label={t('이전글')}
          title={prevPost.title}
          icon="expand_more"
        />
      )}

      <div className="mt-16 flex justify-end">
        <Button
          as="link"
          to={listHref}
          variant="solid"
          tone="inverse"
          size="md"
        >
          {t('목록')}
        </Button>
      </div>
    </div>
  );
}

const PostNavLink = ({
  href,
  label,
  title,
  icon,
}: {
  href: string;
  label: string;
  title: string;
  icon: string;
}) => (
  <Link to={href} className="group mb-[2px] flex w-fit items-center">
    <span className="material-symbols-rounded font-normal text-main-orange">
      {icon}
    </span>
    <p className="mr-3 shrink-0 text-md font-medium text-main-orange">
      {label}
    </p>
    <p className="line-clamp-1 text-md font-normal group-hover:underline">
      {title}
    </p>
  </Link>
);
