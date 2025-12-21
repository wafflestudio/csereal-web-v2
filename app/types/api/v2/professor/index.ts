export const FACULTY_STATUS = {
  ACTIVE: '교수',
  INACTIVE: '역대 교수',
  VISITING: '객원 교수',
} as const;

export type FacultyStatus = keyof typeof FACULTY_STATUS;

export type WithLanguage<T> = {
  ko: T;
  en: T;
};

export interface SimpleFaculty {
  id: number;
  status: FacultyStatus;
  name: string;
  imageURL: string | null;
  academicRank: string;
  phone: string | null;
  email: string | null;
  labId: number | null;
  labName: string | null;
}

export interface FacultyList {
  description: string;
  professors: SimpleFaculty[];
}

export interface Faculty extends SimpleFaculty {
  office: string | null;
  fax: string | null;
  website: string | null;
  educations: string[];
  researchAreas: string[];
  careers: string[];
  startDate: string;
  endDate: string;
}

export interface SimpleEmeritusFaculty {
  id: number;
  name: string;
  imageURL: string | null;
  academicRank: string;
  email: string | null;
}

export interface EmeritusFaculty extends SimpleEmeritusFaculty {
  status: FacultyStatus;
  startDate: string;
  endDate: string;
  researchAreas: string[];
  website: string | null;
  careers: string[];
  office: string | null;
  educations: string[];
}

export interface SimpleStaff {
  id: number;
  name: string;
  imageURL: string | null;
  role: string;
  office: string;
  phone: string;
  email: string;
}

export interface Staff extends SimpleStaff {
  tasks: string[];
}
