import fs from 'fs';
import path from 'path';
import { Habit, HabitCompletion, HabitsDatabase, HabitCompletionsDatabase, CreateHabitDTO, UpdateHabitDTO } from '../types/habit';

const DATA_DIR = path.join(__dirname, '../../data');
const HABITS_FILE = path.join(DATA_DIR, 'habits.json');
const COMPLETIONS_FILE = path.join(DATA_DIR, 'habitCompletions.json');

// Ensure data directory and files exist
function initializeDatabase(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(HABITS_FILE)) {
    const initialHabits: HabitsDatabase = { habits: [] };
    fs.writeFileSync(HABITS_FILE, JSON.stringify(initialHabits, null, 2));
  }
  if (!fs.existsSync(COMPLETIONS_FILE)) {
    const initialCompletions: HabitCompletionsDatabase = { completions: [] };
    fs.writeFileSync(COMPLETIONS_FILE, JSON.stringify(initialCompletions, null, 2));
  }
}

// Read/write habits
export function readHabits(): Habit[] {
  initializeDatabase();
  try {
    const data = fs.readFileSync(HABITS_FILE, 'utf-8');
    const db: HabitsDatabase = JSON.parse(data);
    return db.habits || [];
  } catch (error) {
    console.error('Error reading habits:', error);
    return [];
  }
}

export function writeHabits(habits: Habit[]): boolean {
  initializeDatabase();
  try {
    const db: HabitsDatabase = { habits };
    fs.writeFileSync(HABITS_FILE, JSON.stringify(db, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing habits:', error);
    return false;
  }
}

// Read/write completions
export function readCompletions(): HabitCompletion[] {
  initializeDatabase();
  try {
    const data = fs.readFileSync(COMPLETIONS_FILE, 'utf-8');
    const db: HabitCompletionsDatabase = JSON.parse(data);
    return db.completions || [];
  } catch (error) {
    console.error('Error reading completions:', error);
    return [];
  }
}

export function writeCompletions(completions: HabitCompletion[]): boolean {
  initializeDatabase();
  try {
    const db: HabitCompletionsDatabase = { completions };
    fs.writeFileSync(COMPLETIONS_FILE, JSON.stringify(db, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing completions:', error);
    return false;
  }
}

// Get all habits
export function getAllHabits(): Habit[] {
  return readHabits();
}

// Get habit by ID
export function getHabitById(id: string): Habit | undefined {
  const habits = readHabits();
  return habits.find(habit => habit.id === id);
}

// Create new habit
export function createHabit(habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>): Habit | null {
  const habits = readHabits();
  const { v4: uuidv4 } = require('uuid');
  const now = new Date().toISOString();

  const newHabit: Habit = {
    ...habitData,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };

  habits.push(newHabit);

  if (writeHabits(habits)) {
    return newHabit;
  }
  return null;
}

// Update habit
export function updateHabit(id: string, updates: UpdateHabitDTO): Habit | null {
  const habits = readHabits();
  const index = habits.findIndex(habit => habit.id === id);

  if (index === -1) {
    return null;
  }

  const updatedHabit: Habit = {
    ...habits[index],
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  };

  habits[index] = updatedHabit;

  if (writeHabits(habits)) {
    return updatedHabit;
  }
  return null;
}

// Delete habit (also deletes all completions)
export function deleteHabit(id: string): boolean {
  const habits = readHabits();
  const filteredHabits = habits.filter(habit => habit.id !== id);

  if (filteredHabits.length === habits.length) {
    return false;
  }

  // Also delete all completions for this habit
  const completions = readCompletions();
  const filteredCompletions = completions.filter(c => c.habitId !== id);
  writeCompletions(filteredCompletions);

  return writeHabits(filteredHabits);
}

// Mark habit complete for a date
export function markHabitComplete(habitId: string, date: string): HabitCompletion | null {
  const completions = readCompletions();

  // Check if already completed
  const existing = completions.find(c => c.habitId === habitId && c.date === date);
  if (existing) {
    return existing;
  }

  const newCompletion: HabitCompletion = {
    habitId,
    date,
    completedAt: new Date().toISOString(),
  };

  completions.push(newCompletion);

  if (writeCompletions(completions)) {
    return newCompletion;
  }
  return null;
}

// Remove habit completion for a date
export function markHabitIncomplete(habitId: string, date: string): boolean {
  const completions = readCompletions();
  const filteredCompletions = completions.filter(c => !(c.habitId === habitId && c.date === date));

  if (filteredCompletions.length === completions.length) {
    return false;
  }

  return writeCompletions(filteredCompletions);
}

// Get habit completions in date range
export function getHabitCompletionsInRange(habitId: string, startDate: string, endDate: string): HabitCompletion[] {
  const completions = readCompletions();
  const start = new Date(startDate);
  const end = new Date(endDate);

  return completions.filter(c => {
    if (c.habitId !== habitId) return false;
    const completionDate = new Date(c.date);
    return completionDate >= start && completionDate <= end;
  });
}

// Get habit streak count
export function getHabitStreak(habitId: string): number {
  const habit = getHabitById(habitId);
  if (!habit) return 0;

  const completions = readCompletions();
  const habitCompletions = completions
    .filter(c => c.habitId === habitId)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (habitCompletions.length === 0) return 0;

  let streak = 0;
  let checkDate = new Date();
  checkDate.setHours(0, 0, 0, 0);

  for (const completion of habitCompletions) {
    const completionDate = new Date(completion.date);
    completionDate.setHours(0, 0, 0, 0);

    // For daily habits, check consecutive days
    if (habit.frequency === 'daily') {
      const diffDays = Math.floor((checkDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0 || diffDays === 1) {
        streak++;
        checkDate = completionDate;
      } else {
        break;
      }
    }
    // For weekly habits, check if completion date is within the current or previous week
    else if (habit.frequency === 'weekly') {
      const dayOfWeek = completionDate.getDay();

      // Check if this day is a target day
      if (habit.targetDays.includes(dayOfWeek)) {
        const diffDays = Math.floor((checkDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays <= 7) {
          streak++;
          checkDate = completionDate;
        } else {
          break;
        }
      }
    }
  }

  return streak;
}

// Get habits for a specific date with completion status
export function getHabitsForDate(date: string): Array<Habit & { completed: boolean; streak?: number }> {
  const habits = readHabits();
  const completions = readCompletions();
  const targetDate = new Date(date);
  const dayOfWeek = targetDate.getDay();

  return habits.map(habit => {
    const isCompleted = completions.some(
      c => c.habitId === habit.id && c.date === date
    );

    // Check if habit should be shown on this date
    const shouldShow = habit.frequency === 'daily' || habit.targetDays.includes(dayOfWeek);

    return {
      ...habit,
      completed: isCompleted,
      streak: shouldShow ? getHabitStreak(habit.id) : undefined,
    };
  }).filter(habit => {
    // Filter based on frequency
    if (habit.frequency === 'daily') return true;
    return habit.targetDays.includes(dayOfWeek);
  });
}

// Get completion status for a habit on a specific date
export function getHabitCompletion(habitId: string, date: string): boolean {
  const completions = readCompletions();
  return completions.some(c => c.habitId === habitId && c.date === date);
}
