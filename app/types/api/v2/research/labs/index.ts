import type { Attachment } from '~/types/api/v2/attachment';

export interface ResearchLabProfessor {
  id: number;
  name: string;
}

export interface SimpleResearchLab {
  id: number;
  name: string;
  professors: ResearchLabProfessor[];
  location: string | null;
  tel: string | null;
  acronym: string;
  pdf: Attachment | null;
  youtube: string | null;
}

export interface ResearchLab extends SimpleResearchLab {
  description: string;
  websiteURL: string | null;
  group: { id: number; name: string } | null;
}

export type ResearchLabWithLanguage = {
  ko: ResearchLab;
  en: ResearchLab;
};
