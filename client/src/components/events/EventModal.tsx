import React from 'react';
import type { Event, CreateEventDTO } from '../../hooks/useEvents';
import { Modal } from '../ui/Modal';
import { EventForm } from './EventForm';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event;
  initialDate?: Date;
  onSubmit: (data: CreateEventDTO) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  initialDate,
  onSubmit,
  onDelete,
}) => {
  const handleSubmit = async (data: CreateEventDTO) => {
    await onSubmit(data);
    onClose();
  };

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? 'Edit Event' : 'Create Event'}
    >
      <EventForm
        event={event}
        initialDate={initialDate}
        onSubmit={handleSubmit}
        onCancel={onClose}
        onDelete={onDelete ? handleDelete : undefined}
      />
    </Modal>
  );
};
