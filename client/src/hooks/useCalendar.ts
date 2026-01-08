import { useState, useCallback } from 'react';
import {
  navigateMonth,
  navigateWeek,
  navigateDay,
  formatDate,
} from '../utils/dateUtils';

type CalendarView = 'month' | 'week' | 'day';

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Navigate to previous period
  const goToPrevious = useCallback(() => {
    setCurrentDate(prev => {
      switch (view) {
        case 'month':
          return navigateMonth(prev, 'prev');
        case 'week':
          return navigateWeek(prev, 'prev');
        case 'day':
          return navigateDay(prev, 'prev');
        default:
          return prev;
      }
    });
  }, [view]);

  // Navigate to next period
  const goToNext = useCallback(() => {
    setCurrentDate(prev => {
      switch (view) {
        case 'month':
          return navigateMonth(prev, 'next');
        case 'week':
          return navigateWeek(prev, 'next');
        case 'day':
          return navigateDay(prev, 'next');
        default:
          return prev;
      }
    });
  }, [view]);

  // Go to today
  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Change view
  const changeView = useCallback((newView: CalendarView) => {
    setView(newView);
  }, []);

  // Select a date
  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  // Get formatted date range for header
  const getDateRangeText = useCallback((): string => {
    switch (view) {
      case 'month':
        return formatDate(currentDate, 'MMMM yyyy');
      case 'week':
        return formatDate(currentDate, "'Week of' MMM dd, yyyy");
      case 'day':
        return formatDate(currentDate, 'EEEE, MMMM dd, yyyy');
      default:
        return formatDate(currentDate);
    }
  }, [currentDate, view]);

  return {
    currentDate,
    view,
    selectedDate,
    goToPrevious,
    goToNext,
    goToToday,
    changeView,
    selectDate,
    getDateRangeText,
  };
}
