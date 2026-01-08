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
      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
        habit.completed ? 'shadow-lg' : ''
      }`}
      style={{
        backgroundColor: habit.completed ? `${habit.color}40` : 'white',
        borderColor: habit.completed ? habit.color : `${habit.color}80`,
        boxShadow: habit.completed ? `0 4px 12px ${habit.color}40` : undefined,
      }}
    >
      <div
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors`}
        style={{
          backgroundColor: habit.completed ? habit.color : 'transparent',
          borderColor: habit.color,
        }}
      >
        {habit.completed && <Check size={14} className="text-white" />}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`font-medium truncate ${
            habit.completed ? 'line-through' : ''
          }`}
          style={{ color: habit.completed ? habit.color : 'inherit' }}
        >
          {habit.title}
        </p>

        {habit.description && !habit.completed && (
          <p className="text-sm text-gray-500 truncate mt-1">{habit.description}</p>
        )}

        <div className="flex items-center gap-2 mt-1">
          {habit.streak !== undefined && habit.streak > 0 && (
            <div className="flex items-center gap-1 text-xs font-medium" style={{ color: habit.color }}>
              <Flame size={12} />
              {habit.streak} day{habit.streak !== 1 ? 's' : ''}
            </div>
          )}
          <span className="text-xs text-gray-400">
            {habit.frequency === 'daily' ? 'Daily' : 'Weekly'}
          </span>
        </div>
      </div>
    </div>
  );
};
