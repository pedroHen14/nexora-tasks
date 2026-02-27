export type ReminderType = 'none' | '5min' | '15min' | '30min' | '1hour' | '1day';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string; // ISO date string
  dueTime?: string; // HH:mm format
  categoryId?: string;
  tags: string[];
  reminder?: ReminderType;
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export type TaskFilter = 'all' | 'pending' | 'completed';

export type TaskGroup = 'today' | 'tomorrow' | 'this_week' | 'later' | 'overdue' | 'no_date';

export interface SyncStatus {
  isSyncing: boolean;
  lastSyncedAt?: string;
  error?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
