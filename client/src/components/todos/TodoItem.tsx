import React from 'react';
import { Check, CheckCircle } from 'lucide-react';
import type { Todo } from '../../hooks/useTodos';
import { format, parseISO } from 'date-fns';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onClick: (todo: Todo) => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  high: 'bg-red-100 text-red-800 border-red-300',
};

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onClick }) => {
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(todo.id);
  };

  return (
    <div
      onClick={() => onClick(todo)}
      onContextMenu={handleRightClick}
      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg ${
        todo.completed
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 shadow-md'
          : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md'
      }`}
    >
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          todo.completed
            ? 'bg-gradient-primary border-indigo-600 scale-110'
            : 'border-gray-300 hover:border-indigo-400'
        }`}
      >
        {todo.completed && <Check size={14} className="text-white" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={`font-semibold truncate transition-all duration-200 ${
              todo.completed ? 'line-through text-green-700' : 'text-gray-900'
            }`}
          >
            {todo.title}
          </p>
          <span
            className={`px-2.5 py-0.5 text-xs font-bold rounded-lg border-2 shadow-sm ${
              priorityColors[todo.priority]
            }`}
          >
            {todo.priority}
          </span>
        </div>

        {todo.description && !todo.completed && (
          <p className="text-sm text-gray-500 truncate mt-1">{todo.description}</p>
        )}

        {todo.dueDate && (
          <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500 font-medium">
            <CheckCircle size={12} className="text-indigo-500" />
            {format(parseISO(todo.dueDate), 'MMM dd, yyyy')}
          </div>
        )}
      </div>
    </div>
  );
};
