import { Router } from 'express';
import {
  getAllEventsController,
  getEventByIdController,
  createEventController,
  updateEventController,
  deleteEventController,
} from '../controllers/eventController';

const router = Router();

// Get all events
router.get('/', getAllEventsController);

// Get single event by ID
router.get('/:id', getEventByIdController);

// Create new event
router.post('/', createEventController);

// Update event
router.put('/:id', updateEventController);

// Delete event
router.delete('/:id', deleteEventController);

export default router;
