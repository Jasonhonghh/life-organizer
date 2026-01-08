import { useState, useEffect, useCallback } from 'react';
import { habitApi, type Habit, type HabitCompletion, type HabitWithCompletion, type CreateHabitDTO, type UpdateHabitDTO } from '../services/api';
import { format } from 'date-fns';

export { type Habit, type HabitWithCompletion, type CreateHabitDTO, type UpdateHabitDTO };

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all habits
  const fetchHabits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await habitApi.getAll();
      setHabits(data);
    } catch (err) {
      setError('Failed to fetch habits');
      console.error('Error fetching habits:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create habit
  const createHabit = useCallback(async (habitData: CreateHabitDTO): Promise<Habit | null> => {
    setLoading(true);
    setError(null);
    try {
      const newHabit = await habitApi.create(habitData);
      setHabits(prev => [...prev, newHabit]);
      return newHabit;
    } catch (err) {
      setError('Failed to create habit');
      console.error('Error creating habit:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update habit
  const updateHabit = useCallback(async (id: string, updates: UpdateHabitDTO): Promise<Habit | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedHabit = await habitApi.update(id, updates);
      setHabits(prev =>
        prev.map(habit => (habit.id === id ? updatedHabit : habit))
      );
      return updatedHabit;
    } catch (err) {
      setError('Failed to update habit');
      console.error('Error updating habit:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete habit
  const deleteHabit = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await habitApi.delete(id);
      setHabits(prev => prev.filter(habit => habit.id !== id));
      setCompletions(prev => prev.filter(c => c.habitId !== id));
      return true;
    } catch (err) {
      setError('Failed to delete habit');
      console.error('Error deleting habit:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark habit complete
  const markHabitComplete = useCallback(async (id: string, date: Date): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      await habitApi.markComplete(id, dateStr);
      setCompletions(prev => {
        const existing = prev.find(c => c.habitId === id && c.date === dateStr);
        if (existing) return prev;
        return [...prev, {
          habitId: id,
          date: dateStr,
          completedAt: new Date().toISOString(),
        }];
      });
    } catch (err) {
      setError('Failed to mark habit complete');
      console.error('Error marking habit complete:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark habit incomplete
  const markHabitIncomplete = useCallback(async (id: string, date: Date): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      await habitApi.markIncomplete(id, dateStr);
      setCompletions(prev =>
        prev.filter(c => !(c.habitId === id && c.date === dateStr))
      );
    } catch (err) {
      setError('Failed to mark habit incomplete');
      console.error('Error marking habit incomplete:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get habit streak
  const getHabitStreak = useCallback(async (id: string): Promise<number> => {
    try {
      return await habitApi.getStreak(id);
    } catch (err) {
      console.error('Error getting habit streak:', err);
      return 0;
    }
  }, []);

  // Get habits for a specific date
  const getHabitsForDate = useCallback(async (date: Date): Promise<HabitWithCompletion[]> => {
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      return await habitApi.getForDate(dateStr);
    } catch (err) {
      console.error('Error getting habits for date:', err);
      return [];
    }
  }, []);

  // Get habits in a date range (simplified version)
  const getHabitsInRange = useCallback((start: Date, end: Date): HabitWithCompletion[] => {
    const habitsInRange: HabitWithCompletion[] = [];
    const current = new Date(start);
    current.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    while (current <= endDate) {
      const dateStr = format(current, 'yyyy-MM-dd');
      const dayOfWeek = current.getDay();

      habits.forEach(habit => {
        const isCompleted = completions.some(
          c => c.habitId === habit.id && c.date === dateStr
        );

        const shouldShow = habit.frequency === 'daily' || habit.targetDays.includes(dayOfWeek);

        if (shouldShow) {
          habitsInRange.push({
            ...habit,
            completed: isCompleted,
          });
        }
      });

      current.setDate(current.getDate() + 1);
    }

    return habitsInRange;
  }, [habits, completions]);

  // Load habits on mount
  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  return {
    habits,
    completions,
    loading,
    error,
    fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    markHabitComplete,
    markHabitIncomplete,
    getHabitStreak,
    getHabitsForDate,
    getHabitsInRange,
  };
}
