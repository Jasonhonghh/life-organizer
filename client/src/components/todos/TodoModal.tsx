import React from 'react';
import type { Todo, CreateTodoDTO } from '../../hooks/useTodos';
import { Modal } from '../ui/Modal';
import { TodoForm } from './TodoForm';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo?: Todo;
  initialDate?: Date;
  onSubmit: (data: CreateTodoDTO) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export const TodoModal: React.FC<TodoModalProps> = ({
  isOpen,
  onClose,
  todo,
  initialDate,
  onSubmit,
  onDelete,
}) => {
  const handleSubmit = async (data: CreateTodoDTO) => {
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
      title={todo ? 'Edit Todo' : 'Create Todo'}
    >
      <TodoForm
        todo={todo}
        initialDate={initialDate}
        onSubmit={handleSubmit}
        onCancel={onClose}
        onDelete={onDelete ? handleDelete : undefined}
      />
    </Modal>
  );
};
