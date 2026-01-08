import React, { useState, useEffect } from 'react';
import type { Habit, CreateHabitDTO } from '../../hooks/useHabits';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const PRESET_COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Orange', value: '#F59E0B' },
  { name: 'Red', value: '#EF4444' },
];

interface HabitFormProps {
  habit?: Habit;
  onSubmit: (data: CreateHabitDTO) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export const HabitForm: React.FC<HabitFormProps> = ({
  habit,
  onSubmit,
  onCancel,
  onDelete,
}) => {
  const [title, setTitle] = useState(habit?.title || '');
  const [description, setDescription] = useState(habit?.description || '');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>(
    habit?.frequency || 'daily'
  );
  const [targetDays, setTargetDays] = useState<number[]>(
    habit?.targetDays || [0, 1, 2, 3, 4, 5, 6]
  );
  const [color, setColor] = useState(habit?.color || '#3B82F6');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (habit) {
      setTitle(habit.title);
      setDescription(habit.description);
      setFrequency(habit.frequency);
      setTargetDays(habit.targetDays);
      setColor(habit.color);
    }
  }, [habit]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (frequency === 'weekly' && targetDays.length === 0) {
      newErrors.targetDays = 'Select at least one day';
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
      frequency,
      targetDays,
      color,
    });
  };

  const toggleDay = (dayIndex: number) => {
    setTargetDays(prev =>
      prev.includes(dayIndex)
        ? prev.filter(d => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Habit Name"
        value={title}
        onChange={e => setTitle(e.target.value)}
        error={errors.title}
        placeholder="e.g., Exercise, Read, Meditate"
        required
      />

      <Textarea
        label="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Why is this habit important? (optional)"
      />

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Frequency
        </label>
        <div className="flex gap-2">
          {(['daily', 'weekly'] as const).map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setFrequency(f)}
              className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                frequency === f
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {frequency === 'weekly' && (
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Select Days {errors.targetDays && <span className="text-red-500 ml-1">{errors.targetDays}</span>}
          </label>
          <div className="flex gap-2 flex-wrap">
            {DAYS.map((day, index) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(index)}
                className={`w-10 h-10 rounded-full border-2 font-medium transition-all text-sm ${
                  targetDays.includes(index)
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Color
        </label>
        <div className="flex gap-2 flex-wrap">
          {PRESET_COLORS.map(({ name, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setColor(value)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                color === value ? 'border-gray-900 scale-110' : 'border-gray-300 hover:scale-110'
              }`}
              style={{ backgroundColor: value }}
              title={name}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" className="flex-1">
          {habit ? 'Update Habit' : 'Create Habit'}
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
