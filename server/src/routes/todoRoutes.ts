import { Router } from 'express';
import {
  getAllTodosController,
  getTodoByIdController,
  createTodoController,
  updateTodoController,
  deleteTodoController,
  toggleTodoController,
  getTodosInRangeController,
} from '../controllers/todoController';

const router = Router();

// Get all todos
router.get('/', getAllTodosController);

// Get todos in date range
router.get('/range/:start/:end', getTodosInRangeController);

// Get single todo by ID
router.get('/:id', getTodoByIdController);

// Create new todo
router.post('/', createTodoController);

// Update todo
router.put('/:id', updateTodoController);

// Delete todo
router.delete('/:id', deleteTodoController);

// Toggle todo completion
router.patch('/:id/toggle', toggleTodoController);

export default router;
