import axios from 'axios';
import type { Event, CreateEventDTO, UpdateEventDTO } from '../hooks/useEvents';

// Todo types
export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CreateTodoDTO {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateTodoDTO {
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

// Habit types
export interface Habit {
  id: string;
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

export interface HabitWithCompletion extends Habit {
  completed: boolean;
  streak?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const eventApi = {
  // Get all events
  getAll: async (): Promise<Event[]> => {
    const response = await api.get('/events');
    return response.data.data;
  },

  // Get single event by ID
  getById: async (id: string): Promise<Event> => {
    const response = await api.get(`/events/${id}`);
    return response.data.data;
  },

  // Create new event
  create: async (event: CreateEventDTO): Promise<Event> => {
    const response = await api.post('/events', event);
    return response.data.data;
  },

  // Update event
  update: async (id: string, updates: UpdateEventDTO): Promise<Event> => {
    const response = await api.put(`/events/${id}`, updates);
    return response.data.data;
  },

  // Delete event
  delete: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },
};

export const todoApi = {
  // Get all todos
  getAll: async (): Promise<Todo[]> => {
    const response = await api.get('/todos');
    return response.data.data;
  },

  // Get todos in date range
  getByDateRange: async (start: string, end: string): Promise<Todo[]> => {
    const response = await api.get(`/todos/range/${start}/${end}`);
    return response.data.data;
  },

  // Get single todo by ID
  getById: async (id: string): Promise<Todo> => {
    const response = await api.get(`/todos/${id}`);
    return response.data.data;
  },

  // Create new todo
  create: async (todo: CreateTodoDTO): Promise<Todo> => {
    const response = await api.post('/todos', todo);
    return response.data.data;
  },

  // Update todo
  update: async (id: string, updates: UpdateTodoDTO): Promise<Todo> => {
    const response = await api.put(`/todos/${id}`, updates);
    return response.data.data;
  },

  // Delete todo
  delete: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },

  // Toggle todo completion
  toggle: async (id: string): Promise<Todo> => {
    const response = await api.patch(`/todos/${id}/toggle`);
    return response.data.data;
  },
};

export const habitApi = {
  // Get all habits
  getAll: async (): Promise<Habit[]> => {
    const response = await api.get('/habits');
    return response.data.data;
  },

  // Get habits for a specific date
  getForDate: async (date: string): Promise<HabitWithCompletion[]> => {
    const response = await api.get(`/habits/date/${date}`);
    return response.data.data;
  },

  // Get single habit by ID
  getById: async (id: string): Promise<Habit> => {
    const response = await api.get(`/habits/${id}`);
    return response.data.data;
  },

  // Create new habit
  create: async (habit: CreateHabitDTO): Promise<Habit> => {
    const response = await api.post('/habits', habit);
    return response.data.data;
  },

  // Update habit
  update: async (id: string, updates: UpdateHabitDTO): Promise<Habit> => {
    const response = await api.put(`/habits/${id}`, updates);
    return response.data.data;
  },

  // Delete habit
  delete: async (id: string): Promise<void> => {
    await api.delete(`/habits/${id}`);
  },

  // Mark habit complete
  markComplete: async (id: string, date: string): Promise<HabitCompletion> => {
    const response = await api.patch(`/habits/${id}/complete`, { date });
    return response.data.data;
  },

  // Remove habit completion
  markIncomplete: async (id: string, date: string): Promise<void> => {
    await api.delete(`/habits/${id}/complete/${date}`);
  },

  // Get habit streak
  getStreak: async (id: string): Promise<number> => {
    const response = await api.get(`/habits/${id}/streak`);
    return response.data.data.streak;
  },

  // Get habit completions in range
  getCompletions: async (id: string, start: string, end: string): Promise<HabitCompletion[]> => {
    const response = await api.get(`/habits/${id}/completions?start=${start}&end=${end}`);
    return response.data.data;
  },
};

export default api;
