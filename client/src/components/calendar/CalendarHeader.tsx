import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, CheckCircle, Flame } from 'lucide-react';
import { Button } from '../ui/Button';

type CalendarView = 'month' | 'week' | 'day';

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  dateRangeText: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: CalendarView) => void;
  onAddEvent: () => void;
  onAddTodo: () => void;
  onAddHabit: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  view,
  dateRangeText,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
  onAddEvent,
  onAddTodo,
  onAddHabit,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="text-blue-600" size={28} />
            <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onToday}>
            Today
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="secondary" size="sm" onClick={onPrevious}>
              <ChevronLeft size={20} />
            </Button>
            <Button variant="secondary" size="sm" onClick={onNext}>
              <ChevronRight size={20} />
            </Button>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
            {dateRangeText}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewChange('day')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                view === 'day'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => onViewChange('week')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                view === 'week'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => onViewChange('month')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                view === 'month'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Month
            </button>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={onAddTodo}>
              <CheckCircle size={16} className="mr-1" />
              Todo
            </Button>
            <Button variant="secondary" size="sm" onClick={onAddHabit}>
              <Flame size={16} className="mr-1" />
              Habit
            </Button>
            <Button variant="primary" onClick={onAddEvent}>
              + Add Event
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
