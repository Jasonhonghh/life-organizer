export interface Habit {
  id: string;
  userId: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly';
  targetDays: number[];
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface HabitCompletion {
  habitId: string;
  userId: string;
  date: string;
  completedAt: string;
}

export interface CreateHabitDTO {
  title: string;
  description?: string;
  frequency?: 'daily' | 'weekly';
  targetDays?: number[];
  color?: string;
}

export interface UpdateHabitDTO {
  title?: string;
  description?: string;
  frequency?: 'daily' | 'weekly';
  targetDays?: number[];
  color?: string;
}

export interface HabitsDatabase {
  habits: Habit[];
}

export interface HabitCompletionsDatabase {
  completions: HabitCompletion[];
}
