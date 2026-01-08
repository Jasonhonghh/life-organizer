import React from 'react';
import type { Event } from '../../hooks/useEvents';
import type { Todo as TodoType } from '../../hooks/useTodos';
import type { Habit, HabitWithCompletion } from '../../hooks/useHabits';
import { getMonthDays, isCurrentMonth, isToday } from '../../utils/dateUtils';
import { EventItem } from './EventItem';
import { CalendarOverlays } from './CalendarOverlays';
import { format } from 'date-fns';

interface MonthViewProps {
  currentDate: Date;
  events: Event[];
  todos?: TodoType[];
  habits?: Habit[];
  completions?: { habitId: string; date: string; completedAt: string }[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
  onTodoClick?: (todo: TodoType) => void;
  onHabitClick?: (habit: HabitWithCompletion) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  events,
  todos = [],
  habits = [],
  completions = [],
  onDateClick,
  onEventClick,
  onTodoClick,
  onHabitClick,
}) => {
  const monthDays = getMonthDays(currentDate);

  // Get events for a specific day
  const getEventsForDay = (day: Date): Event[] => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getDate() === day.getDate() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getFullYear() === day.getFullYear()
      );
    });
  };

  // Get todos for a specific day
  const getTodosForDay = (day: Date): TodoType[] => {
    return todos.filter(todo => {
      if (!todo.dueDate) return false;
      const todoDate = new Date(todo.dueDate);
      return (
        todoDate.getDate() === day.getDate() &&
        todoDate.getMonth() === day.getMonth() &&
        todoDate.getFullYear() === day.getFullYear()
      );
    });
  };

  // Get habits for a specific day with completion status
  const getHabitsForDay = (day: Date): HabitWithCompletion[] => {
    const dayOfWeek = day.getDay();
    const dateStr = format(day, 'yyyy-MM-dd');

    return habits
      .filter(habit => {
        if (habit.frequency === 'daily') return true;
        return habit.targetDays.includes(dayOfWeek);
      })
      .map(habit => {
        const completion = completions.find(c => c.habitId === habit.id && c.date === dateStr);
        return {
          ...habit,
          completed: !!completion,
        };
      });
  };

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {WEEKDAYS.map(day => (
          <div
            key={day}
            className="px-2 py-3 text-center text-sm font-semibold text-gray-700 bg-gray-50"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 flex-1 auto-rows-fr">
        {monthDays.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const dayTodos = getTodosForDay(day);
          const dayHabits = getHabitsForDay(day);
          const isCurrent = isCurrentMonth(day, currentDate);
          const isTodayDate = isToday(day);

          return (
            <div
              key={index}
              onClick={() => onDateClick(day)}
              className={`min-h-[120px] p-2 border-r border-b border-gray-200 cursor-pointer transition-colors ${
                !isCurrent ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-semibold ${
                    isTodayDate
                      ? 'w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-md'
                      : isCurrent
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  }`}
                >
                  {day.getDate()}
                </span>
              </div>

              <div className="space-y-1.5 max-h-[80px] overflow-y-auto">
                {dayEvents.slice(0, 3).map(event => (
                  <EventItem key={event.id} event={event} onClick={onEventClick} />
                ))}
                {dayEvents.length >= 3 ? (
                  dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 px-2 py-1">
                      +{dayEvents.length - 3} more
                    </div>
                  )
                ) : (
                  <CalendarOverlays
                    todos={dayTodos}
                    habits={dayHabits}
                    maxItems={3 - dayEvents.length}
                    onTodoClick={(todo) => {
                      onTodoClick?.(todo);
                    }}
                    onTodoToggle={(todoId) => {
                      const todo = dayTodos.find(t => t.id === todoId);
                      if (todo && onTodoClick) {
                        onTodoClick(todo);
                      }
                    }}
                    onHabitClick={(habit) => {
                      onHabitClick?.(habit);
                    }}
                    onHabitToggle={(habitId) => {
                      const habit = dayHabits.find(h => h.id === habitId);
                      if (habit && onHabitClick) {
                        onHabitClick(habit);
                      }
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
