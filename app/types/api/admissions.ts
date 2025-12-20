export type WithLanguage<T> = {
  ko: T;
  en: T;
};

export type AdmissionsResponse = WithLanguage<{ description: string }>;
