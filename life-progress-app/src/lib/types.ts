export interface User {
  id: string;
  telegram_id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  timezone: string;
  notifications_enabled: boolean;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export type TaskStatus = "active" | "completed";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  scheduled_date: string; // YYYY-MM-DD
  scheduled_time: string | null; // HH:MM
  status: TaskStatus;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DailyProgress {
  date: string;
  completed: number;
  planned: number;
}

export interface MonthProgress {
  month: string; // YYYY-MM
  days: DailyProgress[]; // only days with at least one task
}
