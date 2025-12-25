export const ADMIN_MENU_SLIDE = 'slide';
export const ADMIN_MENU_IMPORTANT = 'important';

export interface SlidePreview {
  id: number;
  title: string;
  createdAt: string;
}

export interface SlidePreviewList {
  slides: SlidePreview[];
  total: number;
}

export type ImportantCategory = 'notice' | 'news' | 'seminar';

export interface ImportantPreview {
  id: number;
  title: string;
  createdAt: string;
  category: ImportantCategory;
}

export interface ImportantPreviewList {
  importants: ImportantPreview[];
  total: number;
}

export interface ImportantPostIdentifier {
  id: number;
  category: ImportantCategory;
}
