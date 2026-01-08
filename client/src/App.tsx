import { useState } from 'react';
import { CalendarHeader } from './components/calendar/CalendarHeader';
import { MonthView } from './components/calendar/MonthView';
import { WeekView } from './components/calendar/WeekView';
import { DayView } from './components/calendar/DayView';
import { EventModal } from './components/events/EventModal';
import { TodoModal } from './components/todos/TodoModal';
import { HabitModal } from './components/habits/HabitModal';
import { useEvents, type Event, type CreateEventDTO } from './hooks/useEvents';
import { useTodos, type Todo as TodoType, type CreateTodoDTO } from './hooks/useTodos';
import { useHabits, type Habit as HabitType, type HabitWithCompletion, type CreateHabitDTO } from './hooks/useHabits';
import { useCalendar } from './hooks/useCalendar';
import { format } from 'date-fns';

function App() {
  const { events, loading, createEvent, updateEvent, deleteEvent } = useEvents();
  const { todos, createTodo, updateTodo, deleteTodo, toggleTodo, getTodosForDate } = useTodos();
  const {
    habits,
    completions,
    createHabit,
    updateHabit,
    deleteHabit,
    markHabitComplete,
    markHabitIncomplete,
    getHabitsForDate,
  } = useHabits();

  const {
    currentDate,
    view,
    selectedDate,
    goToPrevious,
    goToNext,
    goToToday,
    changeView,
    selectDate,
    getDateRangeText,
  } = useCalendar();

  // Modal states
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const [selectedTodo, setSelectedTodo] = useState<TodoType | undefined>();
  const [selectedHabit, setSelectedHabit] = useState<HabitType | undefined>();

  const handleAddEvent = () => {
    setSelectedEvent(undefined);
    setIsEventModalOpen(true);
  };

  const handleAddTodo = () => {
    setSelectedTodo(undefined);
    setIsTodoModalOpen(true);
  };

  const handleAddHabit = () => {
    setSelectedHabit(undefined);
    setIsHabitModalOpen(true);
  };

  const handleDateClick = (date: Date) => {
    selectDate(date);
    setSelectedEvent(undefined);
    setIsEventModalOpen(true);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleTodoClick = (todo: TodoType) => {
    setSelectedTodo(todo);
    setIsTodoModalOpen(true);
  };

  const handleHabitClick = (habit: HabitWithCompletion) => {
    setSelectedHabit(habit);
    setIsHabitModalOpen(true);
  };

  const handleSubmitEvent = async (data: CreateEventDTO) => {
    if (selectedEvent) {
      await updateEvent(selectedEvent.id, data);
    } else {
      await createEvent(data);
    }
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      await deleteEvent(selectedEvent.id);
    }
  };

  const handleSubmitTodo = async (data: CreateTodoDTO) => {
    if (selectedTodo) {
      await updateTodo(selectedTodo.id, data);
    } else {
      await createTodo(data);
    }
  };

  const handleDeleteTodo = async () => {
    if (selectedTodo) {
      await deleteTodo(selectedTodo.id);
    }
  };

  const handleSubmitHabit = async (data: CreateHabitDTO) => {
    if (selectedHabit) {
      await updateHabit(selectedHabit.id, data);
    } else {
      await createHabit(data);
    }
  };

  const handleDeleteHabit = async () => {
    if (selectedHabit) {
      await deleteHabit(selectedHabit.id);
    }
  };

  const handleTodoToggle = async (todoId: string) => {
    await toggleTodo(todoId);
  };

  const handleHabitToggle = async (habitId: string, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const isCompleted = completions.some(c => c.habitId === habitId && c.date === dateStr);
    if (isCompleted) {
      await markHabitIncomplete(habitId, date);
    } else {
      await markHabitComplete(habitId, date);
    }
  };

  const renderView = () => {
    const dateTodos = getTodosForDate(currentDate);

    const fetchHabitsForDate = async () => {
      return await getHabitsForDate(currentDate);
    };

    switch (view) {
      case 'month':
        return (
          <MonthView
            currentDate={currentDate}
            events={events}
            todos={todos}
            habits={habits}
            completions={completions}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onTodoClick={handleTodoClick}
            onHabitClick={handleHabitClick}
          />
        );
      case 'week':
        return (
          <WeekView
            currentDate={currentDate}
            events={events}
            todos={todos}
            habits={habits}
            completions={completions}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onTodoClick={handleTodoClick}
            onHabitClick={handleHabitClick}
          />
        );
      case 'day':
        return (
          <DayView
            currentDate={currentDate}
            events={events}
            todos={dateTodos}
            fetchHabitsForDate={fetchHabitsForDate}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onTodoClick={handleTodoClick}
            onTodoToggle={handleTodoToggle}
            onHabitClick={handleHabitClick}
            onHabitToggle={handleHabitToggle}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        dateRangeText={getDateRangeText()}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onToday={goToToday}
        onViewChange={changeView}
        onAddEvent={handleAddEvent}
        onAddTodo={handleAddTodo}
        onAddHabit={handleAddHabit}
      />

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          {renderView()}
        </div>
      )}

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        event={selectedEvent}
        initialDate={selectedDate || undefined}
        onSubmit={handleSubmitEvent}
        onDelete={selectedEvent ? handleDeleteEvent : undefined}
      />

      <TodoModal
        isOpen={isTodoModalOpen}
        onClose={() => setIsTodoModalOpen(false)}
        todo={selectedTodo}
        initialDate={selectedDate || undefined}
        onSubmit={handleSubmitTodo}
        onDelete={selectedTodo ? handleDeleteTodo : undefined}
      />

      <HabitModal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
        habit={selectedHabit}
        onSubmit={handleSubmitHabit}
        onDelete={selectedHabit ? handleDeleteHabit : undefined}
      />
    </div>
  );
}

export default App;
