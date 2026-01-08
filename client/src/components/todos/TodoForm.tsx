import React, { useState, useEffect } from 'react';
import type { Todo, CreateTodoDTO } from '../../hooks/useTodos';
import { format, parseISO } from 'date-fns';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

interface TodoFormProps {
  todo?: Todo;
  initialDate?: Date;
  onSubmit: (data: CreateTodoDTO) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  todo,
  initialDate,
  onSubmit,
  onCancel,
  onDelete,
}) => {
  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [dueDate, setDueDate] = useState(
    todo?.dueDate
      ? format(parseISO(todo.dueDate), "yyyy-MM-dd'T'HH:mm")
      : initialDate
      ? format(initialDate, "yyyy-MM-dd'T'HH:mm")
      : ''
  );
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(
    todo?.priority || 'medium'
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description);
      setDueDate(
        todo.dueDate ? format(parseISO(todo.dueDate), "yyyy-MM-dd'T'HH:mm") : ''
      );
      setPriority(todo.priority);
    }
  }, [todo]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || undefined,
      priority,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        error={errors.title}
        placeholder="What needs to be done?"
        required
      />

      <Textarea
        label="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Add details (optional)"
      />

      <Input
        label="Due Date & Time"
        type="datetime-local"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
      />

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Priority
        </label>
        <div className="flex gap-2">
          {(['low', 'medium', 'high'] as const).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                priority === p
                  ? p === 'low'
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : p === 'medium'
                    ? 'bg-yellow-100 border-yellow-500 text-yellow-800'
                    : 'bg-red-100 border-red-500 text-red-800'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" className="flex-1">
          {todo ? 'Update Todo' : 'Create Todo'}
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
