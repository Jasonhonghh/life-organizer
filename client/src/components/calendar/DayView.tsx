import React, { useEffect, useState } from 'react';
import type { Event } from '../../hooks/useEvents';
import type { Todo as TodoType } from '../../hooks/useTodos';
import type { HabitWithCompletion } from '../../hooks/useHabits';
import { format, parseISO, isSameDay } from 'date-fns';
import { TodoItem } from '../todos/TodoItem';
import { HabitItem } from '../habits/HabitItem';

interface DayViewProps {
  currentDate: Date;
  events: Event[];
  todos?: TodoType[];
  fetchHabitsForDate?: (date: Date) => Promise<HabitWithCompletion[]>;
  onDateClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
  onTodoClick?: (todo: TodoType) => void;
  onTodoToggle?: (todoId: string) => void;
  onHabitClick?: (habit: HabitWithCompletion, date: Date) => void;
  onHabitToggle?: (habitId: string, date: Date) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const DayView: React.FC<DayViewProps> = ({
  currentDate,
  events,
  todos = [],
  fetchHabitsForDate,
  onDateClick,
  onEventClick,
  onTodoClick,
  onTodoToggle,
  onHabitClick,
  onHabitToggle,
}) => {
  const [habits, setHabits] = useState<HabitWithCompletion[]>([]);

  useEffect(() => {
    if (fetchHabitsForDate) {
      fetchHabitsForDate(currentDate).then(setHabits);
    }
  }, [currentDate, fetchHabitsForDate]);

  // Get events for the current day
  const dayEvents = events.filter(event => {
    const eventDate = new Date(event.startDate);
    return isSameDay(eventDate, currentDate);
  });

  // Get incomplete todos
  const incompleteTodos = todos.filter(t => !t.completed);

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
      {/* Header */}
      <div className="text-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="text-sm text-gray-600 uppercase font-semibold tracking-wide">
          {format(currentDate, 'EEEE')}
        </div>
        <div className="text-4xl font-bold text-gray-900 mt-1">
          {format(currentDate, 'MMMM d, yyyy')}
        </div>
      </div>

      {/* Todos and Habits sections */}
      {(todos.length > 0 || habits.length > 0) && (
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="p-5">
            <div className="grid grid-cols-2 gap-6">
              {/* Todos */}
              {todos.length > 0 && (
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span>📋</span>
                    <span>Tasks ({incompleteTodos.length} remaining)</span>
                  </h3>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {todos.map(todo => (
                      <div
                        key={todo.id}
                        onClick={() => onTodoClick?.(todo)}
                      >
                        <TodoItem
                          todo={todo}
                          onToggle={(id) => onTodoToggle?.(id)}
                          onClick={onTodoClick || (() => {})}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Habits */}
              {habits.length > 0 && (
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span>🔥</span>
                    <span>Daily Habits</span>
                  </h3>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {habits.map(habit => (
                      <div
                        key={habit.id}
                        onClick={() => onHabitClick?.(habit, currentDate)}
                      >
                        <HabitItem
                          habit={habit}
                          date={currentDate}
                          onToggle={(id, date) => onHabitToggle?.(id, date)}
                          onClick={() => {}}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[80px_1fr] relative min-h-[1440px]">
          {/* Time column */}
          <div className="border-r border-gray-200">
            {HOURS.map(hour => (
              <div
                key={hour}
                className="h-[60px] pr-4 text-right text-sm text-gray-500 border-b border-gray-100 flex items-center justify-end"
              >
                {format(new Date().setHours(hour, 0, 0, 0), 'ha')}
              </div>
            ))}
          </div>

          {/* Events column */}
          <div className="relative">
            {/* Hour lines */}
            {HOURS.map(hour => (
              <div
                key={hour}
                className="h-[60px] border-b border-gray-100 hover:bg-blue-50 cursor-pointer"
                onClick={() => {
                  const clickDate = new Date(currentDate);
                  clickDate.setHours(hour, 0, 0, 0);
                  onDateClick(clickDate);
                }}
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
                className="absolute left-2 right-2 px-4 py-2 bg-blue-100 border-l-4 border-blue-600 rounded shadow-sm cursor-pointer hover:bg-blue-200 transition-colors"
              >
                <div className="font-semibold text-blue-900">
                  {event.title}
                </div>
                <div className="text-sm text-blue-700">
                  {format(parseISO(event.startDate), 'h:mm a')} - {format(parseISO(event.endDate), 'h:mm a')}
                </div>
                {event.description && (
                  <div className="text-sm text-blue-800 mt-1 truncate">
                    {event.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
