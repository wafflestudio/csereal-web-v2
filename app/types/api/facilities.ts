export interface Facility {
  id: number;
  name: string;
  description: string;
  locations: string[];
  imageURL: string | null;
}

export type WithLanguage<T> = {
  ko: T;
  en: T;
};

export type FacilitiesResponse = WithLanguage<Facility>[];
