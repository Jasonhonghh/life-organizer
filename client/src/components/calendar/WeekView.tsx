import React from 'react';
import type { Event } from '../../hooks/useEvents';
import type { Todo as TodoType } from '../../hooks/useTodos';
import type { Habit, HabitWithCompletion } from '../../hooks/useHabits';
import { getWeekDays } from '../../utils/dateUtils';
import { format, parseISO, isSameDay } from 'date-fns';
import { CalendarOverlays } from './CalendarOverlays';

interface WeekViewProps {
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

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const WeekView: React.FC<WeekViewProps> = ({
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
  const weekDays = getWeekDays(currentDate);

  // Get events for a specific day
  const getEventsForDay = (day: Date): Event[] => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, day);
    });
  };

  // Get todos for a specific day
  const getTodosForDay = (day: Date): TodoType[] => {
    return todos.filter(todo => {
      if (!todo.dueDate) return false;
      const todoDate = new Date(todo.dueDate);
      return isSameDay(todoDate, day);
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

  // Calculate event position and height
  const getEventStyle = (event: Event) => {
    const startDate = parseISO(event.startDate);
    const endDate = parseISO(event.endDate);

    const startHour = startDate.getHours() + startDate.getMinutes() / 60;
    const endHour = endDate.getHours() + endDate.getMinutes() / 60;
    const duration = endHour - startHour;

    return {
      top: `${startHour * 60}px`,
      height: `${Math.max(duration * 60, 30)}px`,
    };
  };

  return (
    <div className="bg-white h-full flex flex-col overflow-hidden">
      {/* Header with days */}
      <div className="grid grid-cols-8 border-b border-gray-200 flex-shrink-0">
        <div className="p-3 border-r border-gray-200"></div>
        {weekDays.map(day => {
          const isToday = isSameDay(day, new Date());
          return (
            <div
              key={day.toISOString()}
              onClick={() => onDateClick(day)}
              className="text-center p-3 border-r border-gray-200 cursor-pointer hover:bg-gray-50"
            >
              <div className="text-xs text-gray-500 uppercase">
                {format(day, 'EEE')}
              </div>
              <div
                className={`text-lg font-semibold ${
                  isToday
                    ? 'w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full mx-auto'
                    : 'text-gray-900'
                }`}
              >
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-8 relative min-h-[1440px]">
          {/* Time column */}
          <div className="border-r border-gray-200">
            {HOURS.map(hour => (
              <div
                key={hour}
                className="h-[60px] pr-2 text-right text-xs text-gray-500 border-b border-gray-100"
              >
                {format(new Date().setHours(hour, 0, 0, 0), 'ha')}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map(day => {
            const dayEvents = getEventsForDay(day);
            const dayTodos = getTodosForDay(day);
            const dayHabits = getHabitsForDay(day);
            return (
              <div
                key={day.toISOString()}
                onClick={() => onDateClick(day)}
                className="relative border-r border-gray-200 cursor-pointer hover:bg-gray-50"
              >
                {/* Todos and Habits overlay at top */}
                {(dayTodos.length > 0 || dayHabits.length > 0) && (
                  <div className="absolute top-0 left-0 right-0 z-10 p-2 bg-white/95 border-b border-gray-200 shadow-sm">
                    <CalendarOverlays
                      todos={dayTodos}
                      habits={dayHabits}
                      maxItems={3}
                      onTodoClick={(todo) => onTodoClick?.(todo)}
                      onTodoToggle={(todoId) => {
                        const todo = dayTodos.find(t => t.id === todoId);
                        if (todo && onTodoClick) {
                          onTodoClick(todo);
                        }
                      }}
                      onHabitClick={(habit) => onHabitClick?.(habit)}
                      onHabitToggle={(habitId) => {
                        const habit = dayHabits.find(h => h.id === habitId);
                        if (habit && onHabitClick) {
                          onHabitClick(habit);
                        }
                      }}
                    />
                  </div>
                )}

                {/* Hour lines */}
                {HOURS.map(hour => (
                  <div
                    key={hour}
                    className="h-[60px] border-b border-gray-100"
                  />
                ))}

                {/* Events */}
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    style={getEventStyle(event)}
                    className="absolute left-1 right-1 px-2 py-1 bg-blue-100 border-l-4 border-blue-600 rounded text-xs cursor-pointer hover:bg-blue-200 transition-colors overflow-hidden"
                  >
                    <div className="font-medium text-blue-900 truncate">
                      {event.title}
                    </div>
                    <div className="text-blue-700 text-xs">
                      {format(parseISO(event.startDate), 'h:mm a')} - {format(parseISO(event.endDate), 'h:mm a')}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
