import { useState, lazy, Suspense } from 'react';
import { CalendarHeader } from './components/calendar/CalendarHeader';
import { MonthView } from './components/calendar/MonthView';
import { WeekView } from './components/calendar/WeekView';
import { DayView } from './components/calendar/DayView';
import { useEvents, type Event, type CreateEventDTO } from './hooks/useEvents';
import { useTodos, type Todo as TodoType, type CreateTodoDTO } from './hooks/useTodos';
import { useHabits, type Habit as HabitType, type HabitWithCompletion, type CreateHabitDTO } from './hooks/useHabits';
import { useCalendar } from './hooks/useCalendar';
import { format } from 'date-fns';

// Lazy load modals for code splitting
const EventModal = lazy(() => import('./components/events/EventModal').then(m => ({ default: m.EventModal })));
const TodoModal = lazy(() => import('./components/todos/TodoModal').then(m => ({ default: m.TodoModal })));
const HabitModal = lazy(() => import('./components/habits/HabitModal').then(m => ({ default: m.HabitModal })));

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
    <div className="h-screen flex flex-col">
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
          <div className="glass-card rounded-2xl px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700 font-medium">Loading...</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden p-4 md:p-6">
          <div className="glass-card rounded-3xl h-full overflow-hidden fade-in">
            {renderView()}
          </div>
        </div>
      )}

      <Suspense fallback={null}>
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
      </Suspense>
    </div>
  );
}

export default App;
