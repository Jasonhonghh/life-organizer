import { Request, Response } from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../utils/fileDB';
import { CreateEventDTO, UpdateEventDTO } from '../types/event';

// Get all events
export const getAllEventsController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    const events = getAllEvents(req.user.userId);
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch events' });
  }
};

// Get single event by ID
export const getEventByIdController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    const { id } = req.params;
    const event = getEventById(id, req.user.userId);

    if (!event) {
      res.status(404).json({ success: false, error: 'Event not found' });
      return;
    }

    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch event' });
  }
};

// Create new event
export const createEventController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    const { title, description, startDate, endDate, duration }: CreateEventDTO = req.body;

    if (!title || !startDate || !endDate || !duration) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: title, startDate, endDate, duration',
      });
      return;
    }

    const newEvent = createEvent({
      title,
      description: description || '',
      startDate,
      endDate,
      duration,
    }, req.user.userId);

    if (!newEvent) {
      res.status(500).json({ success: false, error: 'Failed to create event' });
      return;
    }

    res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create event' });
  }
};

// Update existing event
export const updateEventController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    const { id } = req.params;
    const updates: UpdateEventDTO = req.body;

    const updatedEvent = updateEvent(id, req.user.userId, updates);

    if (!updatedEvent) {
      res.status(404).json({ success: false, error: 'Event not found' });
      return;
    }

    res.json({ success: true, data: updatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update event' });
  }
};

// Delete event
export const deleteEventController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    const { id } = req.params;
    const deleted = deleteEvent(id, req.user.userId);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Event not found' });
      return;
    }

    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete event' });
  }
};
