import HTMLViewer from '~/components/common/HTMLViewer';
import SelectionTitle from '~/components/common/SelectionTitle';
import type { Club, WithLanguage } from '~/types/api/student-clubs';

interface ClubDetailsProps {
  club: WithLanguage<Club>;
  locale: 'ko' | 'en';
}

export default function ClubDetails({ club, locale }: ClubDetailsProps) {
  const oppositeLocale = locale === 'ko' ? 'en' : 'ko';
  const image = club[locale].imageURL
    ? {
        src: club[locale].imageURL,
        width: 320,
        height: 200,
        mobileFullWidth: true,
      }
    : undefined;

  return (
    <div>
      <SelectionTitle
        title={club[locale].name}
        subtitle={club[oppositeLocale].name}
        animateKey={club[locale].name}
      />
      <HTMLViewer html={club[locale].description} image={image} />
    </div>
  );
}
