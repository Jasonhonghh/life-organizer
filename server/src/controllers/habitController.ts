import { Request, Response } from 'express';
import {
  getAllHabits,
  getHabitById,
  createHabit,
  updateHabit,
  deleteHabit,
  markHabitComplete,
  markHabitIncomplete,
  getHabitStreak,
  getHabitsForDate,
  getHabitCompletionsInRange,
} from '../utils/habitDB';
import { CreateHabitDTO, UpdateHabitDTO } from '../types/habit';

// Get all habits
export const getAllHabitsController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    const habits = getAllHabits(req.user.userId);
    res.json({ success: true, data: habits });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch habits' });
  }
};

// Get habits for a specific date
export const getHabitsForDateController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    const { date } = req.params;
    const habits = getHabitsForDate(date, req.user.userId);
    res.json({ success: true, data: habits });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch habits' });
  }
};

// Get single habit by ID
export const getHabitByIdController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    const { id } = req.params;
    const habit = getHabitById(id, req.user.userId);

    if (!habit) {
      res.status(404).json({ success: false, error: 'Habit not found' });
      return;
    }

    res.json({ success: true, data: habit });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch habit' });
  }
};

// Create new habit
export const createHabitController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    const { title, description, frequency, targetDays, color }: CreateHabitDTO = req.body;

    if (!title) {
      res.status(400).json({
        success: false,
        error: 'Missing required field: title',
      });
      return;
    }

    const newHabit = createHabit({
      title,
      description: description || '',
      frequency: frequency || 'daily',
      targetDays: targetDays || [0, 1, 2, 3, 4, 5, 6],
      color: color || '#3B82F6',
    }, req.user.userId);

    if (!newHabit) {
      res.status(500).json({ success: false, error: 'Failed to create habit' });
      return;
    }

    res.status(201).json({ success: true, data: newHabit });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create habit' });
  }
};

// Update habit
export const updateHabitController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    const { id } = req.params;
    const updates: UpdateHabitDTO = req.body;

    const updatedHabit = updateHabit(id, req.user.userId, updates);

    if (!updatedHabit) {
      res.status(404).json({ success: false, error: 'Habit not found' });
      return;
    }

    res.json({ success: true, data: updatedHabit });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update habit' });
  }
};

// Delete habit
export const deleteHabitController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    const { id } = req.params;
    const deleted = deleteHabit(id, req.user.userId);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Habit not found' });
      return;
    }

    res.json({ success: true, message: 'Habit deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete habit' });
  }
};

// Mark habit complete
export const markHabitCompleteController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    const { id } = req.params;
    const { date } = req.body;

    if (!date) {
      res.status(400).json({
        success: false,
        error: 'Missing required field: date',
      });
      return;
    }

    const completion = markHabitComplete(id, req.user.userId, date);

    if (!completion) {
      res.status(500).json({ success: false, error: 'Failed to mark habit complete' });
      return;
    }

    res.json({ success: true, data: completion });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to mark habit complete' });
  }
};

// Remove habit completion
export const markHabitIncompleteController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    const { id, date } = req.params;
    const success = markHabitIncomplete(id, req.user.userId, date);

    if (!success) {
      res.status(404).json({ success: false, error: 'Completion not found' });
      return;
    }

    res.json({ success: true, message: 'Habit marked incomplete' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to mark habit incomplete' });
  }
};

// Get habit streak
export const getHabitStreakController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    const { id } = req.params;
    const streak = getHabitStreak(id, req.user.userId);
    res.json({ success: true, data: { streak } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get streak' });
  }
};

// Get habit completions in range
export const getHabitCompletionsController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    const { id } = req.params;
    const { start, end } = req.query;

    if (!start || !end) {
      res.status(400).json({
        success: false,
        error: 'Missing required query parameters: start, end',
      });
      return;
    }

    const completions = getHabitCompletionsInRange(id, req.user.userId, start as string, end as string);
    res.json({ success: true, data: completions });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch completions' });
  }
};
