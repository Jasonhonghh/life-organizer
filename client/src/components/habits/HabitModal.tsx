import React from 'react';
import type { Habit, CreateHabitDTO } from '../../hooks/useHabits';
import { Modal } from '../ui/Modal';
import { HabitForm } from './HabitForm';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit?: Habit;
  onSubmit: (data: CreateHabitDTO) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  onClose,
  habit,
  onSubmit,
  onDelete,
}) => {
  const handleSubmit = async (data: CreateHabitDTO) => {
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
      title={habit ? 'Edit Habit' : 'Create Habit'}
    >
      <HabitForm
        habit={habit}
        onSubmit={handleSubmit}
        onCancel={onClose}
        onDelete={onDelete ? handleDelete : undefined}
      />
    </Modal>
  );
};
