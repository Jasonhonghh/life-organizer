import React from 'react';
import type { Event } from '../../hooks/useEvents';
import { format, parseISO } from 'date-fns';

interface EventItemProps {
  event: Event;
  onClick: (event: Event) => void;
}

export const EventItem: React.FC<EventItemProps> = ({ event, onClick }) => {
  const startDate = parseISO(event.startDate);
  const startTime = format(startDate, 'h:mm a');

  return (
    <div
      onClick={() => onClick(event)}
      className="px-2 py-1.5 mb-1 text-xs rounded-lg cursor-pointer transition-all duration-200 truncate shadow-sm hover:shadow-md hover:scale-[1.02]"
      style={{
        background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
        borderLeft: '3px solid #6366f1',
        color: '#1e1b4b',
      }}
      title={`${event.title} - ${startTime}`}
    >
      <span className="font-bold">{startTime}</span> <span className="font-medium">{event.title}</span>
    </div>
  );
};
