export interface ReservationPreview {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
}

export interface Reservation {
  id: number;
  recurrenceId: string;
  startTime: string;
  endTime: string;
  recurringWeeks: number;
  title: string;
  professor: string;
  purpose?: string;
  roomName: string | null;
  roomLocation: string;
  userName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
}

export interface ReservationPostBody {
  roomId: number;
  startTime: string;
  endTime: string;
  recurringWeeks: number;
  title: string;
  contactEmail: string;
  contactPhone: string;
  professor: string;
  purpose: string;
  agreed: boolean;
}
