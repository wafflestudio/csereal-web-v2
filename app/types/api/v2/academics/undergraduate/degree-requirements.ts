import type { Attachment } from '~/types/api/v2/attachment';

export interface DegreeRequirements {
  description: string;
  attachments: Attachment[];
}
