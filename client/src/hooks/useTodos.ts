import { useState, useEffect, useCallback } from 'react';
import { todoApi, type Todo, type CreateTodoDTO, type UpdateTodoDTO } from '../services/api';

export { type Todo, type CreateTodoDTO, type UpdateTodoDTO };

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all todos
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await todoApi.getAll();
      setTodos(data);
    } catch (err) {
      setError('Failed to fetch todos');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create todo
  const createTodo = useCallback(async (todoData: CreateTodoDTO): Promise<Todo | null> => {
    setLoading(true);
    setError(null);
    try {
      const newTodo = await todoApi.create(todoData);
      setTodos(prev => [...prev, newTodo]);
      return newTodo;
    } catch (err) {
      setError('Failed to create todo');
      console.error('Error creating todo:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update todo
  const updateTodo = useCallback(async (id: string, updates: UpdateTodoDTO): Promise<Todo | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedTodo = await todoApi.update(id, updates);
      setTodos(prev =>
        prev.map(todo => (todo.id === id ? updatedTodo : todo))
      );
      return updatedTodo;
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error updating todo:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete todo
  const deleteTodo = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await todoApi.delete(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle todo completion
  const toggleTodo = useCallback(async (id: string): Promise<Todo | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedTodo = await todoApi.toggle(id);
      setTodos(prev =>
        prev.map(todo => (todo.id === id ? updatedTodo : todo))
      );
      return updatedTodo;
    } catch (err) {
      setError('Failed to toggle todo');
      console.error('Error toggling todo:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get todos for a specific date
  const getTodosForDate = useCallback((date: Date): Todo[] => {
    return todos.filter(todo => {
      if (!todo.dueDate) return false;
      const todoDate = new Date(todo.dueDate);
      return todoDate.toDateString() === date.toDateString();
    });
  }, [todos]);

  // Get todos in a date range
  const getTodosInRange = useCallback((start: Date, end: Date): Todo[] => {
    return todos.filter(todo => {
      if (!todo.dueDate) return false;
      const todoDate = new Date(todo.dueDate);
      return todoDate >= start && todoDate <= end;
    });
  }, [todos]);

  // Get incomplete todos
  const getIncompleteTodos = useCallback((): Todo[] => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  // Load todos on mount
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    getTodosForDate,
    getTodosInRange,
    getIncompleteTodos,
  };
}
