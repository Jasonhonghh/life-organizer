import React from 'react';
import { Check, Flame } from 'lucide-react';
import type { HabitWithCompletion } from '../../hooks/useHabits';

interface HabitItemProps {
  habit: HabitWithCompletion;
  date: Date;
  onToggle: (id: string, date: Date) => void;
  onClick?: (habit: HabitWithCompletion) => void;
}

export const HabitItem: React.FC<HabitItemProps> = ({ habit, date, onToggle, onClick }) => {
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(habit.id, date);
  };

  return (
    <div
      onClick={() => onClick?.(habit)}
      onContextMenu={handleRightClick}
      className="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
      style={{
        backgroundColor: habit.completed ? 'white' : 'white',
        borderColor: habit.completed ? habit.color : `${habit.color}40`,
        boxShadow: habit.completed
          ? `0 10px 25px -5px ${habit.color}40, 0 8px 10px -6px ${habit.color}30`
          : '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      }}
    >
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
          habit.completed ? 'scale-110' : ''
        }`}
        style={{
          background: habit.completed
            ? `linear-gradient(135deg, ${habit.color} 0%, ${habit.color}dd 100%)`
            : 'transparent',
          borderColor: habit.color,
        }}
      >
        {habit.completed && <Check size={14} className="text-white" />}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`font-bold truncate transition-all duration-200 ${
            habit.completed ? 'line-through' : ''
          }`}
          style={{ color: habit.completed ? habit.color : 'inherit' }}
        >
          {habit.title}
        </p>

        {habit.description && !habit.completed && (
          <p className="text-sm text-gray-500 truncate mt-1">{habit.description}</p>
        )}

        <div className="flex items-center gap-2 mt-1.5">
          {habit.streak !== undefined && habit.streak > 0 && (
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
              style={{
                color: habit.color,
                backgroundColor: `${habit.color}20`,
              }}
            >
              <Flame size={12} className="pulse-soft" />
              {habit.streak} day{habit.streak !== 1 ? 's' : ''}
            </div>
          )}
          <span className="text-xs text-gray-400 font-medium">
            {habit.frequency === 'daily' ? 'Daily' : 'Weekly'}
          </span>
        </div>
      </div>
    </div>
  );
};
