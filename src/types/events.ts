
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
  google_meet_link?: string;
  payment_qr_code?: string;
};

export type EventFilters = {
  category?: string;
  searchQuery?: string;
  startDate?: Date;
  endDate?: Date;
};

export type RegistrationFormData = {
  name: string;
  email: string;
  phone: string;
};

export type EventRegistration = {
  id: string;
  event_id: string;
  user_id: string;
  payment_status: 'pending' | 'pending_verification' | 'approved' | 'rejected';
  payment_qr_code?: string;
  payment_proof_url?: string;
  transaction_id?: string;
  payment_notes?: string;
  attendee_name?: string;
  attendee_email?: string;
  attendee_phone?: string;
  created_at: string;
  updated_at?: string;
};
