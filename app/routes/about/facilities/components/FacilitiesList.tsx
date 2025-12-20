import HTMLViewer from '~/components/common/HTMLViewer';
import type { Facility } from '~/types/api/facilities';
import distanceIcon from '../assets/distance.svg';

export default function FacilitiesList({
  facilities,
}: {
  facilities: Facility[];
}) {
  return (
    <div className="mt-[-20px] flex flex-col divide-y divide-neutral-200">
      {facilities.map((facility) => (
        <FacilitiesRow key={facility.id} facility={facility} />
      ))}
    </div>
  );
}

function FacilitiesRow({ facility }: { facility: Facility }) {
  return (
    <article className="flex flex-col-reverse items-start justify-between gap-5 py-5 sm:flex-row">
      <div className="flex flex-col sm:w-142">
        <h3 className="mb-3 text-base font-bold leading-5">{facility.name}</h3>
        <HTMLViewer html={facility.description} />
        <div className="flex translate-x-[-4px] items-start gap-px">
          <img src={distanceIcon} alt="" className="shrink-0" />
          <p className="pt-0.5 text-md text-neutral-500">
            {facility.locations.join(', ')}
          </p>
        </div>
      </div>
      <FacilitiesRowImage imageURL={facility.imageURL ?? ''} />
    </article>
  );
}

function FacilitiesRowImage({ imageURL }: { imageURL: string }) {
  return (
    <div className="relative h-44 w-full shrink-0 sm:w-60">
      <img
        alt="대표 이미지"
        src={encodeURI(imageURL)}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
