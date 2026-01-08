import fs from 'fs';
import path from 'path';
import { Event, EventsDatabase } from '../types/event';

const DATA_DIR = path.join(__dirname, '../../data');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');

// Ensure data directory and file exist
function initializeDatabase(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(EVENTS_FILE)) {
    const initialData: EventsDatabase = { events: [] };
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Read all events from file
export function readEvents(): Event[] {
  initializeDatabase();
  try {
    const data = fs.readFileSync(EVENTS_FILE, 'utf-8');
    const db: EventsDatabase = JSON.parse(data);
    return db.events || [];
  } catch (error) {
    console.error('Error reading events:', error);
    return [];
  }
}

// Write all events to file
export function writeEvents(events: Event[]): boolean {
  initializeDatabase();
  try {
    const db: EventsDatabase = { events };
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(db, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing events:', error);
    return false;
  }
}

// Get all events
export function getAllEvents(): Event[] {
  return readEvents();
}

// Get event by ID
export function getEventById(id: string): Event | undefined {
  const events = readEvents();
  return events.find(event => event.id === id);
}

// Create new event
export function createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Event | null {
  const events = readEvents();
  const { v4: uuidv4 } = require('uuid');
  const now = new Date().toISOString();

  const newEvent: Event = {
    ...eventData,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };

  events.push(newEvent);

  if (writeEvents(events)) {
    return newEvent;
  }
  return null;
}

// Update event
export function updateEvent(id: string, updates: Partial<Event>): Event | null {
  const events = readEvents();
  const index = events.findIndex(event => event.id === id);

  if (index === -1) {
    return null;
  }

  const updatedEvent: Event = {
    ...events[index],
    ...updates,
    id, // Ensure ID cannot be changed
    updatedAt: new Date().toISOString(),
  };

  events[index] = updatedEvent;

  if (writeEvents(events)) {
    return updatedEvent;
  }
  return null;
}

// Delete event
export function deleteEvent(id: string): boolean {
  const events = readEvents();
  const filteredEvents = events.filter(event => event.id !== id);

  if (filteredEvents.length === events.length) {
    return false; // Event not found
  }

  return writeEvents(filteredEvents);
}
