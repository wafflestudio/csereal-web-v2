import type { Attachment } from '../attachment';

export interface SimpleResearchLab {
  id: number;
  name: string;
  professors: { id: number; name: string }[];
  location: string;
  tel: string;
  acronym: string;
  pdf: Attachment | null;
  youtube: string;
}

export interface ResearchLab extends SimpleResearchLab {
  description: string;
  websiteURL: string | null;
  group: { id: number; name: string };
}
