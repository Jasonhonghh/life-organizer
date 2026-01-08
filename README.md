# 📅 Life Organizer

A full-featured calendar application with integrated todo list and habit tracking capabilities. Manage your events, tasks, and daily habits in one beautiful, responsive interface.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?logo=typescript)
![Node](https://img.shields.io/badge/Node-18+-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.19.2-000000?logo=express)

## ✨ Features

### 📆 Calendar
- **Multiple Views**: Month, Week, and Day views
- **Event Management**: Create, edit, and delete events
- **Time-based Scheduling**: Set start and end times for events
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Hot Reload**: Instant updates during development

### ✅ Todo List
- **Task Management**: Create, complete, and delete todos
- **Priority Levels**: Low, Medium, and High priorities with color coding
- **Due Dates**: Set due dates for tasks
- **Quick Toggle**: Right-click to toggle completion status
- **Visual Feedback**: Green highlighting for completed tasks

### 🔥 Habit Tracking
- **Daily & Weekly Habits**: Set habits for daily or specific days of the week
- **Streak Counting**: Track consecutive days of habit completion
- **Custom Colors**: Personalize habits with color coding
- **Progress Tracking**: Visual indicators for completion status
- **Quick Toggle**: Right-click to mark habits complete/incomplete

### 🎨 User Interface
- **Modern Design**: Clean, intuitive interface with Tailwind CSS
- **Color Coding**: Visual priority and status indicators
- **Smooth Animations**: Transitions and hover effects
- **Accessibility**: Keyboard navigation and screen reader support
- **Dark/Light Mode Ready**: Infrastructure for theming

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0**: UI library
- **TypeScript 5.7.2**: Type safety
- **Vite 7.3.0**: Build tool and dev server
- **Tailwind CSS 3.4.0**: Styling
- **date-fns**: Date manipulation
- **lucide-react**: Icons
- **axios**: HTTP client

### Backend
- **Node.js 18+**: Runtime environment
- **Express 4.19.2**: Web framework
- **TypeScript 5.7.2**: Type safety
- **cors**: Cross-origin resource sharing
- **uuid**: Unique ID generation

### Storage
- **JSON File Database**: Simple, file-based data persistence
- **No External Dependencies**: No database setup required

## 📦 Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Clone the Repository
```bash
git clone https://github.com/Jasonhonghh/life-organizer.git
cd life-organizer
```

### Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

## 🚀 Usage

### Development Mode

#### Start the Backend Server
```bash
cd server
npm run dev
```
Server runs on `http://localhost:3001`

#### Start the Frontend Dev Server
```bash
cd client
npm run dev
```
Client runs on `http://localhost:5173`

### Production Build

#### Build Frontend
```bash
cd client
npm run build
```

#### Start Backend in Production
```bash
cd server
npm start
```

## 📁 Project Structure

```
life-organizer/
├── client/                     # Frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── calendar/      # Calendar views (Month/Week/Day)
│   │   │   ├── events/        # Event components
│   │   │   ├── todos/         # Todo components
│   │   │   ├── habits/        # Habit components
│   │   │   └── ui/            # Reusable UI components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service layer
│   │   ├── types/             # TypeScript type definitions
│   │   ├── utils/             # Utility functions
│   │   ├── App.tsx            # Main application component
│   │   └── main.tsx           # Application entry point
│   ├── public/                # Static assets
│   ├── index.html             # HTML template
│   ├── package.json           # Frontend dependencies
│   └── vite.config.ts         # Vite configuration
│
├── server/                    # Backend application
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── routes/           # API route definitions
│   │   ├── types/            # TypeScript type definitions
│   │   ├── utils/            # Database utilities
│   │   ├── middleware/       # Express middleware
│   │   └── index.ts          # Server entry point
│   ├── data/                 # JSON database files
│   ├── package.json          # Backend dependencies
│   └── tsconfig.json         # TypeScript configuration
│
└── README.md                 # Project documentation
```

## 🔌 API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Todos
- `GET /api/todos` - Get all todos
- `GET /api/todos/range/:start/:end` - Get todos in date range
- `GET /api/todos/:id` - Get todo by ID
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `PATCH /api/todos/:id/toggle` - Toggle todo completion

### Habits
- `GET /api/habits` - Get all habits
- `GET /api/habits/date/:date` - Get habits for specific date
- `GET /api/habits/:id/streak` - Get habit streak count
- `POST /api/habits` - Create new habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `PATCH /api/habits/:id/complete` - Mark habit complete for date
- `DELETE /api/habits/:id/complete/:date` - Remove habit completion

## 🎯 Usage Examples

### Creating an Event
1. Click the "+ Add Event" button
2. Fill in the event title, description, dates, and times
3. Click "Save Event"

### Managing Todos
1. Click the "Todo" button to create a new todo
2. Set title, description, due date, and priority
3. Right-click any todo to toggle completion
4. Left-click to edit or delete

### Tracking Habits
1. Click the "Habit" button to create a new habit
2. Set habit name, description, and frequency (Daily/Weekly)
3. Choose a color for visual identification
4. For weekly habits, select specific days
5. Right-click to mark habits complete/incomplete
6. View streak counts to track progress

## 🌐 Deployment

### Environment Variables
Create a `.env` file in the `/client` directory:
```env
VITE_API_URL=http://your-server-url:3001/api
```

### Deployment Options

#### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the 'dist' folder
```

#### Backend (Render/Heroku)
```bash
cd server
npm start
# Ensure PORT environment variable is set
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Jason Hong**

- GitHub: [@Jasonhonghh](https://github.com/Jasonhonghh)

## 🙏 Acknowledgments

- [Calendar ideas](https://fullcalendar.io/)
- [Habit tracking inspiration](https://www.habitica.com/)
- [React community](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

Made with ❤️ and [Claude Code](https://claude.com/claude-code)
