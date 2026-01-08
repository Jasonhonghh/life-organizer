import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, CheckCircle, Flame } from 'lucide-react';

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
    <div className="glass-card mx-4 mt-4 mb-2 rounded-2xl px-6 py-4 slide-in-right">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
              <Calendar className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Life Organizer</h1>
              <p className="text-xs text-gray-500">Calendar • Tasks • Habits</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToday}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
          >
            Today
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={onPrevious}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
            <button
              onClick={onNext}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 min-w-[200px] text-center px-4 py-2 bg-white rounded-lg shadow-sm">
            {dateRangeText}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white/80 backdrop-blur-sm rounded-lg p-1 shadow-sm">
            <button
              onClick={() => onViewChange('day')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                view === 'day'
                  ? 'bg-gradient-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => onViewChange('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                view === 'week'
                  ? 'bg-gradient-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => onViewChange('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                view === 'month'
                  ? 'bg-gradient-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Month
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onAddTodo}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-sm font-medium text-gray-700">Todo</span>
            </button>
            <button
              onClick={onAddHabit}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <Flame size={16} className="text-orange-500" />
              <span className="text-sm font-medium text-gray-700">Habit</span>
            </button>
            <button
              onClick={onAddEvent}
              className="btn-primary flex items-center gap-2"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Event</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
