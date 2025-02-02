export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'live_session' | 'webinar' | 'workshop' | 'short_course';
  capacity: number;
  price: number;
};

export type EventFilters = {
  category?: string;
  searchQuery?: string;
  startDate?: Date;
  endDate?: Date;
};