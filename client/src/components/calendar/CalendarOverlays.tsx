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
      {displayTodos.map((todo, idx) => (
        <div
          key={todo.id}
          onClick={() => onTodoClick(todo)}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onTodoToggle?.(todo.id);
          }}
          className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded-lg cursor-pointer transition-all duration-200 truncate ${
            todo.completed
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-sm'
              : 'bg-white text-gray-700 shadow-sm hover:shadow-md hover:scale-[1.02]'
          }`}
          style={{ animationDelay: `${idx * 50}ms` }}
          title={`${todo.title}${todo.completed ? ' (completed)' : ''}`}
        >
          {todo.completed ? (
            <Check size={10} className="flex-shrink-0 text-green-600" />
          ) : (
            <CheckCircle2 size={10} className="flex-shrink-0 text-gray-400" />
          )}
          <span className={`truncate font-medium ${todo.completed ? 'line-through' : ''}`}>{todo.title}</span>
        </div>
      ))}

      {/* Habits */}
      {displayHabits.map((habit, idx) => (
        <div
          key={habit.id}
          onClick={() => onHabitClick(habit)}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onHabitToggle?.(habit.id);
          }}
          className="flex items-center gap-1.5 px-2 py-1 text-xs rounded-lg cursor-pointer transition-all duration-200 truncate shadow-sm hover:shadow-md hover:scale-[1.02]"
          style={{
            backgroundColor: habit.completed ? `${habit.color}40` : 'white',
            color: habit.completed ? habit.color : habit.color,
            border: `1.5px solid ${habit.color}${habit.completed ? '80' : '30'}`,
            animationDelay: `${(displayTodos.length + idx) * 50}ms`,
          }}
          title={`${habit.title}${habit.streak ? ` - ${habit.streak} day streak` : ''}`}
        >
          {habit.completed ? (
            <Check size={10} className="flex-shrink-0" style={{ color: habit.color }} />
          ) : (
            <div className="w-2 h-2 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: habit.color }} />
          )}
          <span className={`truncate font-semibold ${habit.completed ? 'line-through' : ''}`}>
            {habit.title}
          </span>
          {habit.streak && habit.streak > 0 && (
            <Flame size={10} className="flex-shrink-0 ml-auto" style={{ color: habit.color }} />
          )}
        </div>
      ))}

      {/* Overflow indicator */}
      {overflowCount > 0 && (
        <div className="text-xs text-gray-500 px-2 py-1 font-medium">
          +{overflowCount} more
        </div>
      )}
    </div>
  );
};
