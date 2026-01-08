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

export interface TodosDatabase {
  todos: Todo[];
}
