import fs from 'fs';
import path from 'path';
import { Todo, TodosDatabase, CreateTodoDTO, UpdateTodoDTO } from '../types/todo';

const DATA_DIR = path.join(__dirname, '../../data');
const TODOS_FILE = path.join(DATA_DIR, 'todos.json');

// Ensure data directory and file exist
function initializeDatabase(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(TODOS_FILE)) {
    const initialData: TodosDatabase = { todos: [] };
    fs.writeFileSync(TODOS_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Read all todos from file
export function readTodos(): Todo[] {
  initializeDatabase();
  try {
    const data = fs.readFileSync(TODOS_FILE, 'utf-8');
    const db: TodosDatabase = JSON.parse(data);
    return db.todos || [];
  } catch (error) {
    console.error('Error reading todos:', error);
    return [];
  }
}

// Write all todos to file
export function writeTodos(todos: Todo[]): boolean {
  initializeDatabase();
  try {
    const db: TodosDatabase = { todos };
    fs.writeFileSync(TODOS_FILE, JSON.stringify(db, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing todos:', error);
    return false;
  }
}

// Get all todos
export function getAllTodos(userId: string): Todo[] {
  const todos = readTodos();
  return todos.filter(todo => todo.userId === userId);
}

// Get todo by ID
export function getTodoById(id: string, userId: string): Todo | undefined {
  const todos = readTodos();
  return todos.find(todo => todo.id === id && todo.userId === userId);
}

// Create new todo
export function createTodo(todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'userId'>, userId: string): Todo | null {
  const todos = readTodos();
  const { v4: uuidv4 } = require('uuid');
  const now = new Date().toISOString();

  const newTodo: Todo = {
    ...todoData,
    id: uuidv4(),
    userId,
    createdAt: now,
    updatedAt: now,
    completedAt: todoData.completed ? now : undefined,
  };

  todos.push(newTodo);

  if (writeTodos(todos)) {
    return newTodo;
  }
  return null;
}

// Update todo
export function updateTodo(id: string, userId: string, updates: UpdateTodoDTO): Todo | null {
  const todos = readTodos();
  const index = todos.findIndex(todo => todo.id === id && todo.userId === userId);

  if (index === -1) {
    return null;
  }

  const updatedTodo: Todo = {
    ...todos[index],
    ...updates,
    id,
    userId,
    updatedAt: new Date().toISOString(),
    completedAt: updates.completed === true
      ? (todos[index].completedAt || new Date().toISOString())
      : updates.completed === false
      ? undefined
      : todos[index].completedAt,
  };

  todos[index] = updatedTodo;

  if (writeTodos(todos)) {
    return updatedTodo;
  }
  return null;
}

// Delete todo
export function deleteTodo(id: string, userId: string): boolean {
  const todos = readTodos();
  const filteredTodos = todos.filter(todo => !(todo.id === id && todo.userId === userId));

  if (filteredTodos.length === todos.length) {
    return false;
  }

  return writeTodos(filteredTodos);
}

// Toggle todo completion
export function toggleTodoCompletion(id: string, userId: string): Todo | null {
  const todos = readTodos();
  const index = todos.findIndex(todo => todo.id === id && todo.userId === userId);

  if (index === -1) {
    return null;
  }

  const currentCompleted = todos[index].completed;
  const updatedTodo: Todo = {
    ...todos[index],
    completed: !currentCompleted,
    updatedAt: new Date().toISOString(),
    completedAt: !currentCompleted ? new Date().toISOString() : undefined,
  };

  todos[index] = updatedTodo;

  if (writeTodos(todos)) {
    return updatedTodo;
  }
  return null;
}

// Get todos in date range
export function getTodosInRange(startDate: string, endDate: string, userId: string): Todo[] {
  const todos = readTodos().filter(todo => todo.userId === userId);
  const start = new Date(startDate);
  const end = new Date(endDate);

  return todos.filter(todo => {
    if (!todo.dueDate) return false;
    const todoDate = new Date(todo.dueDate);
    return todoDate >= start && todoDate <= end;
  });
}
