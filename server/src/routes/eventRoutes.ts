import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getAllEventsController,
  getEventByIdController,
  createEventController,
  updateEventController,
  deleteEventController,
} from '../controllers/eventController';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

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
