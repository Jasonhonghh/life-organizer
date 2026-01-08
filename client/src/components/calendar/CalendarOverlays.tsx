import React from 'react';
import { CheckCircle2, Flame, Check } from 'lucide-react';
import type { Todo } from '../../hooks/useTodos';
import type { HabitWithCompletion } from '../../hooks/useHabits';

interface CalendarOverlaysProps {
  todos: Todo[];
  habits: HabitWithCompletion[];
  maxItems?: number;
  onTodoClick: (todo: Todo) => void;
  onTodoToggle?: (todoId: string) => void;
  onHabitClick: (habit: HabitWithCompletion) => void;
  onHabitToggle?: (habitId: string) => void;
}

export const CalendarOverlays: React.FC<CalendarOverlaysProps> = ({
  todos,
  habits,
  maxItems = 2,
  onTodoClick,
  onTodoToggle,
  onHabitClick,
  onHabitToggle,
}) => {
  const displayTodos = todos.slice(0, maxItems);
  const displayHabits = habits.slice(0, maxItems);

  const totalItems = todos.length + habits.length;
  const overflowCount = totalItems - (displayTodos.length + displayHabits.length);

  return (
    <div className="space-y-1">
      {/* Todos */}
      {displayTodos.map(todo => (
        <div
          key={todo.id}
          onClick={() => onTodoClick(todo)}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onTodoToggle?.(todo.id);
          }}
          className={`flex items-center gap-1 px-1 py-0.5 text-xs rounded cursor-pointer hover:opacity-80 transition-colors truncate ${
            todo.completed
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}
          title={`${todo.title}${todo.completed ? ' (completed)' : ''}`}
        >
          {todo.completed ? (
            <Check size={10} className="flex-shrink-0" />
          ) : (
            <CheckCircle2 size={10} className="flex-shrink-0" />
          )}
          <span className={`truncate ${todo.completed ? 'line-through' : ''}`}>{todo.title}</span>
        </div>
      ))}

      {/* Habits */}
      {displayHabits.map(habit => (
        <div
          key={habit.id}
          onClick={() => onHabitClick(habit)}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onHabitToggle?.(habit.id);
          }}
          className="flex items-center gap-1 px-1 py-0.5 text-xs rounded cursor-pointer hover:opacity-80 transition-colors truncate"
          style={{
            backgroundColor: habit.completed ? `${habit.color}60` : `${habit.color}15`,
            color: habit.completed ? '#000' : habit.color,
            border: `1px solid ${habit.color}`,
          }}
          title={`${habit.title}${habit.streak ? ` - ${habit.streak} day streak` : ''}`}
        >
          {habit.completed ? (
            <Check size={10} className="flex-shrink-0" style={{ color: habit.color }} />
          ) : (
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />
          )}
          <span className={`truncate ${habit.completed ? 'line-through font-medium' : ''}`}>
            {habit.title}
          </span>
          {habit.streak && habit.streak > 0 && (
            <Flame size={10} className="flex-shrink-0" style={{ color: habit.color }} />
          )}
        </div>
      ))}

      {/* Overflow indicator */}
      {overflowCount > 0 && (
        <div className="text-xs text-gray-500 px-1">
          +{overflowCount} more
        </div>
      )}
    </div>
  );
};
