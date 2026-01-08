export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventDTO {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  duration: number;
}

export interface UpdateEventDTO {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  duration?: number;
}

export interface EventsDatabase {
  events: Event[];
}
