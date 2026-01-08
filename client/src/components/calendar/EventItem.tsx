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
      className="px-2 py-1 mb-1 text-xs bg-blue-100 text-blue-900 rounded cursor-pointer hover:bg-blue-200 transition-colors truncate"
      title={`${event.title} - ${startTime}`}
    >
      <span className="font-medium">{startTime}</span> {event.title}
    </div>
  );
};
