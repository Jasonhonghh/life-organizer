import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getAllHabitsController,
  getHabitByIdController,
  createHabitController,
  updateHabitController,
  deleteHabitController,
  markHabitCompleteController,
  markHabitIncompleteController,
  getHabitStreakController,
  getHabitCompletionsController,
  getHabitsForDateController,
} from '../controllers/habitController';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Get all habits
router.get('/', getAllHabitsController);

// Get habits for a specific date
router.get('/date/:date', getHabitsForDateController);

// Get single habit by ID
router.get('/:id', getHabitByIdController);

// Create new habit
router.post('/', createHabitController);

// Update habit
router.put('/:id', updateHabitController);

// Delete habit
router.delete('/:id', deleteHabitController);

// Get habit completions in date range
router.get('/:id/completions', getHabitCompletionsController);

// Mark habit complete
router.patch('/:id/complete', markHabitCompleteController);

// Remove habit completion
router.delete('/:id/complete/:date', markHabitIncompleteController);

// Get habit streak
router.get('/:id/streak', getHabitStreakController);

export default router;
