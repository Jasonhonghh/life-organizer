import React, { useState, useEffect } from 'react';
import type { Event, CreateEventDTO } from '../../hooks/useEvents';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { format, parseISO } from 'date-fns';

interface EventFormProps {
  event?: Event;
  initialDate?: Date;
  onSubmit: (data: CreateEventDTO) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  event,
  initialDate,
  onSubmit,
  onCancel,
  onDelete,
}) => {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [startDate, setStartDate] = useState(
    event
      ? format(parseISO(event.startDate), "yyyy-MM-dd'T'HH:mm")
      : format(initialDate || new Date(), "yyyy-MM-dd'T'HH:mm")
  );
  const [duration, setDuration] = useState(event?.duration || 60);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setStartDate(format(parseISO(event.startDate), "yyyy-MM-dd'T'HH:mm"));
      setDuration(event.duration);
    }
  }, [event]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (duration <= 0) {
      newErrors.duration = 'Duration must be positive';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const start = new Date(startDate);
    const end = new Date(start.getTime() + duration * 60000);

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      duration,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        error={errors.title}
        placeholder="Event title"
        required
      />

      <Textarea
        label="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Event description (optional)"
      />

      <Input
        label="Start Date & Time"
        type="datetime-local"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
        error={errors.startDate}
        required
      />

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Duration (minutes)
        </label>
        <select
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={15}>15 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={45}>45 minutes</option>
          <option value={60}>1 hour</option>
          <option value={90}>1.5 hours</option>
          <option value={120}>2 hours</option>
          <option value={180}>3 hours</option>
        </select>
        {errors.duration && (
          <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" className="flex-1">
          {event ? 'Update Event' : 'Create Event'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        {onDelete && (
          <Button type="button" variant="danger" onClick={onDelete}>
            Delete
          </Button>
        )}
      </div>
    </form>
  );
};
