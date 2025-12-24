export const LOCALES = ['ko', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
