import { Request, Response } from 'express';
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoCompletion,
  getTodosInRange,
} from '../utils/todoDB';
import { CreateTodoDTO, UpdateTodoDTO } from '../types/todo';

// Get all todos
export const getAllTodosController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    const todos = getAllTodos(req.user.userId);
    res.json({ success: true, data: todos });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch todos' });
  }
};

// Get todos in date range
export const getTodosInRangeController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    const { start, end } = req.params;
    const todos = getTodosInRange(start, end, req.user.userId);
    res.json({ success: true, data: todos });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch todos' });
  }
};

// Get single todo by ID
export const getTodoByIdController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    const { id } = req.params;
    const todo = getTodoById(id, req.user.userId);

    if (!todo) {
      res.status(404).json({ success: false, error: 'Todo not found' });
      return;
    }

    res.json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch todo' });
  }
};

// Create new todo
export const createTodoController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    const { title, description, dueDate, priority }: CreateTodoDTO = req.body;

    if (!title) {
      res.status(400).json({
        success: false,
        error: 'Missing required field: title',
      });
      return;
    }

    const newTodo = createTodo({
      title,
      description: description || '',
      dueDate,
      priority: priority || 'medium',
      completed: false,
    }, req.user.userId);

    if (!newTodo) {
      res.status(500).json({ success: false, error: 'Failed to create todo' });
      return;
    }

    res.status(201).json({ success: true, data: newTodo });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create todo' });
  }
};

// Update todo
export const updateTodoController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    const { id } = req.params;
    const updates: UpdateTodoDTO = req.body;

    const updatedTodo = updateTodo(id, req.user.userId, updates);

    if (!updatedTodo) {
      res.status(404).json({ success: false, error: 'Todo not found' });
      return;
    }

    res.json({ success: true, data: updatedTodo });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update todo' });
  }
};

// Delete todo
export const deleteTodoController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    const { id } = req.params;
    const deleted = deleteTodo(id, req.user.userId);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Todo not found' });
      return;
    }

    res.json({ success: true, message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete todo' });
  }
};

// Toggle todo completion
export const toggleTodoController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    const { id } = req.params;
    const updatedTodo = toggleTodoCompletion(id, req.user.userId);

    if (!updatedTodo) {
      res.status(404).json({ success: false, error: 'Todo not found' });
      return;
    }

    res.json({ success: true, data: updatedTodo });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to toggle todo' });
  }
};
