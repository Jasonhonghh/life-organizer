import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfDay,
  endOfDay,
  parseISO,
} from 'date-fns';

// Get all days in a month (including padding days from prev/next months)
export function getMonthDays(date: Date): Date[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

// Get all days in a week
export function getWeekDays(date: Date): Date[] {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });

  return eachDayOfInterval({ start: weekStart, end: weekEnd });
}

// Navigate to previous/next month
export function navigateMonth(date: Date, direction: 'prev' | 'next'): Date {
  return direction === 'prev' ? subMonths(date, 1) : addMonths(date, 1);
}

// Navigate to previous/next week
export function navigateWeek(date: Date, direction: 'prev' | 'next'): Date {
  return direction === 'prev' ? subWeeks(date, 1) : addWeeks(date, 1);
}

// Navigate to previous/next day
export function navigateDay(date: Date, direction: 'prev' | 'next'): Date {
  return direction === 'prev' ? subDays(date, 1) : addDays(date, 1);
}

// Format utilities
export function formatDate(date: Date, formatStr: string = 'MMM dd, yyyy'): string {
  return format(date, formatStr);
}

export function formatTime(date: Date): string {
  return format(date, 'h:mm a');
}

export function formatDateTime(date: Date): string {
  return format(date, 'MMM dd, yyyy h:mm a');
}

// Check if a date is in the current month
export function isCurrentMonth(date: Date, currentMonth: Date): boolean {
  return isSameMonth(date, currentMonth);
}

// Check if a date is today
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

// Parse ISO string to Date
export function parseDate(dateString: string): Date {
  return parseISO(dateString);
}

// Get start and end of day
export function getDayBounds(date: Date): { start: Date; end: Date } {
  return {
    start: startOfDay(date),
    end: endOfDay(date),
  };
}
