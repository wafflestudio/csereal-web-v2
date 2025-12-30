import { Fragment } from 'react';
import { Link } from 'react-router';
import { LAB_ROW_ITEM_WIDTH } from '~/routes/research/labs';
import type { SimpleResearchLab } from '~/types/api/v2/research/labs';
import YoutubeIcon from '../assets/youtube_icon.svg?react';

export default function ResearchLabListRow({
  lab,
  localizedPath,
  labelProfessor,
}: {
  lab: SimpleResearchLab;
  localizedPath: (path: string) => string;
  labelProfessor: string;
}) {
  const { id, name, professors, location, tel, acronym, pdf, youtube } = lab;
  const hasLocation = Boolean(location);
  const hasTel = Boolean(tel);
  const hasIntro = Boolean(pdf || youtube);

  return (
    <li className="grid-rows-auto grid grid-cols-[auto_1fr] items-end gap-2 bg-white px-7 py-6 text-sm tracking-[0.02em] odd:bg-neutral-50 sm:flex sm:h-14 sm:flex-nowrap sm:items-center sm:px-2 sm:py-0 sm:odd:bg-white">
      <LabNameCell id={id} name={name} localizedPath={localizedPath} />
      <LabProfessorsCell
        professors={professors}
        localizedPath={localizedPath}
        labelProfessor={labelProfessor}
      />
      <span
        className={`${LAB_ROW_ITEM_WIDTH.location} ${hasLocation ? '' : 'hidden sm:inline'} col-span-3 text-neutral-500`}
      >
        {location}
      </span>
      <span
        className={`${LAB_ROW_ITEM_WIDTH.tel} ${hasTel ? '' : 'hidden sm:inline'} text-neutral-500`}
      >
        {tel}
      </span>
      <span
        className={`${LAB_ROW_ITEM_WIDTH.acronym} -order-2 col-span-2 row-span-1 text-main-orange sm:order-0 sm:text-neutral-500`}
      >
        {acronym}
      </span>
      <LabMaterialsCell
        name={name}
        pdf={pdf}
        youtube={youtube}
        hasIntro={hasIntro}
      />
    </li>
  );
}

function LabNameCell({
  id,
  name,
  localizedPath,
}: {
  id: number;
  name: string;
  localizedPath: (path: string) => string;
}) {
  return (
    <span
      className={`${LAB_ROW_ITEM_WIDTH.name} order-first col-span-1 row-span-1 text-base font-semibold sm:whitespace-normal sm:text-sm sm:font-normal`}
    >
      <Link
        className="text-neutral-900 hover:text-main-orange"
        to={localizedPath(`/research/labs/${id}`)}
      >
        {name}
      </Link>
    </span>
  );
}

function LabProfessorsCell({
  professors,
  localizedPath,
  labelProfessor,
}: {
  professors: { id: number; name: string }[];
  localizedPath: (path: string) => string;
  labelProfessor: string;
}) {
  return (
    <span
      className={`${LAB_ROW_ITEM_WIDTH.professor} col-span-3 text-md text-neutral-800 sm:text-sm sm:text-neutral-900`}
    >
      <span className="sm:hidden">{labelProfessor}: </span>
      {professors.map((info, index) => (
        <Fragment key={info.id}>
          <Link
            to={localizedPath(`/people/faculty/${info.id}`)}
            className="hover:text-main-orange"
          >
            {info.name}
          </Link>
          {index !== professors.length - 1 && ', '}
        </Fragment>
      ))}
    </span>
  );
}

function LabMaterialsCell({
  name,
  pdf,
  youtube,
  hasIntro,
}: {
  name: string;
  pdf: SimpleResearchLab['pdf'];
  youtube: SimpleResearchLab['youtube'];
  hasIntro: boolean;
}) {
  return (
    <span
      className={`${LAB_ROW_ITEM_WIDTH.introMaterial} ${hasIntro ? '' : 'hidden sm:inline'} col-span-3 flex items-center gap-3`}
    >
      {pdf && (
        <a
          href={pdf.url}
          download={`${name} 소개자료`}
          className="h-5"
          title="PDF"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="material-symbols-outlined text-[1.25rem] text-neutral-400 hover:text-neutral-800">
            draft
          </span>
        </a>
      )}
      {youtube && (
        <a
          href={youtube}
          className="h-5 py-0.75"
          title="YOUTUBE"
          target="_blank"
          rel="noopener noreferrer"
        >
          <YoutubeIcon className="fill-neutral-400 hover:fill-neutral-800" />
        </a>
      )}
    </span>
  );
}
