import { newRidgeState } from "react-ridge-state";

interface User {
  id: string;
  display_name: string;
  bio?: string;
  status?: string;
  activity_status?: Record<string, any>;
  username: string;
  email: string;
  connections?: Record<string, any>;
  message_settings?: Record<string, any>;
  notifications?: Record<string, any>;
  blocked_users?: string[];
  join_date: Date;
  language?: string;
}

export const userState = newRidgeState<User | null>(null);
