export interface Client {
  id: string;
  code: string;
  alias: string;
  firstSession: string;
  request: string;
  notes: string;
  createdAt: string;
}

export interface Session {
  id: string;
  clientId: string;
  date: string;
  durationMinutes: number;
  topics: string;
  insights: string;
  homework: string;
  nextSession: string;
  status: 'completed' | 'cancelled' | 'rescheduled';
  transcript: string;
  source: 'manual';
  createdAt: string;
}
