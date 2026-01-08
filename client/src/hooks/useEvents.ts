import { useState, useEffect, useCallback } from 'react';
import { eventApi } from '../services/api';

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateEventDTO {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  duration: number;
}

interface UpdateEventDTO {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  duration?: number;
}

export type { Event, CreateEventDTO, UpdateEventDTO };

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all events
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventApi.getAll();
      setEvents(data);
    } catch (err) {
      setError('Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create event
  const createEvent = useCallback(async (eventData: CreateEventDTO): Promise<Event | null> => {
    setLoading(true);
    setError(null);
    try {
      const newEvent = await eventApi.create(eventData);
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      setError('Failed to create event');
      console.error('Error creating event:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update event
  const updateEvent = useCallback(async (id: string, updates: UpdateEventDTO): Promise<Event | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedEvent = await eventApi.update(id, updates);
      setEvents(prev =>
        prev.map(event => (event.id === id ? updatedEvent : event))
      );
      return updatedEvent;
    } catch (err) {
      setError('Failed to update event');
      console.error('Error updating event:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete event
  const deleteEvent = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await eventApi.delete(id);
      setEvents(prev => prev.filter(event => event.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete event');
      console.error('Error deleting event:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get events for a specific date
  const getEventsForDate = useCallback((date: Date): Event[] => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.toDateString() === date.toDateString();
    });
  }, [events]);

  // Get events for a date range
  const getEventsInRange = useCallback((start: Date, end: Date): Event[] => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate >= start && eventDate <= end;
    });
  }, [events]);

  // Load events on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    getEventsInRange,
  };
}
