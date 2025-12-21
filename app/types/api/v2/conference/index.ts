export interface TopConferenceListResponse {
  modifiedAt: string;
  author: string;
  conferenceList: {
    id: number;
    abbreviation: string;
    name: string;
  }[];
}
