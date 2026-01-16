# EduMentor AI - Project Structure

## Backend (FastAPI + PostgreSQL)

```
backend/
├── ai/
│   └── gemini.py              # Google Gemini AI integration
├── database/
│   ├── base.py                # SQLAlchemy base
│   └── session.py             # Database session management
├── models/
│   ├── user.py                # User model (PostgreSQL)
│   ├── study_plan.py          # Study plan model
│   └── student.py             # Pydantic schemas
├── routes/
│   ├── auth.py                # Login/Signup endpoints
│   ├── study_plan.py          # Study plan CRUD + AI generation
│   ├── quiz.py                # Quiz generation
│   ├── progress.py            # Progress tracking
│   ├── explain.py             # AI explanations
│   ├── resources.py           # Learning resources
│   └── notes.py               # Notes management
├── schemas/
│   └── user.py                # User validation schemas
├── utils/
│   ├── dependencies.py        # JWT auth dependency
│   └── security.py            # Password hashing + JWT
├── .env                       # Environment variables
├── create_tables.py           # Database initialization
├── main.py                    # FastAPI app entry point
└── requirements.txt           # Python dependencies
```

## Frontend (React + Vite)

```
frontend/
├── src/
│   ├── components/
│   │   ├── Card.jsx           # Reusable card component
│   │   ├── PlanCard.jsx       # Study plan day card
│   │   ├── QuizCard.jsx       # Quiz question card
│   │   ├── TaskCard.jsx       # Task item card
│   │   ├── ProgressBar.jsx    # Progress visualization
│   │   └── PieChart.jsx       # Chart component
│   ├── pages/
│   │   ├── Home.jsx           # Landing page
│   │   ├── Login.jsx          # Login page (NEW)
│   │   ├── Signup.jsx         # Signup page (NEW)
│   │   ├── Planner.jsx        # Study plan creation
│   │   ├── Dashboard.jsx      # Progress dashboard
│   │   ├── Quiz.jsx           # Quiz interface
│   │   ├── AIExplain.jsx      # AI explanations
│   │   ├── Resources.jsx      # Learning resources
│   │   └── Notes.jsx          # Notes management
│   ├── utils/
│   │   ├── auth.js            # Token management (NEW)
│   │   └── api.js             # Axios instance with auth (NEW)
│   ├── App.jsx                # Main app with routing
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
├── index.html                 # HTML template
└── package.json               # Node dependencies
```

## Key Files

### Backend Configuration
- `.env` - Database URL, API keys, JWT secret
- `main.py` - FastAPI app, CORS, route registration
- `create_tables.py` - Initialize PostgreSQL tables

### Frontend Configuration
- `package.json` - React, Axios, Recharts, Framer Motion
- `vite.config.js` - Vite build configuration
- `index.html` - HTML entry point

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new account
- `POST /auth/login` - Login and get JWT token

### Study Plans
- `POST /study/plan` - Generate AI study plan (requires auth)
- `GET /study/plans` - List user's study plans (requires auth)
- `GET /study/plans/{id}` - Get specific plan (requires auth)
- `DELETE /study/plans/{id}` - Delete plan (requires auth)
- `PUT /study/plans/{id}/regenerate` - Regenerate plan (requires auth)

### Quiz
- `GET /quiz/generate?topic={topic}` - Generate quiz questions

### Progress
- `GET /progress/` - Get current progress
- `POST /progress/init-plan` - Initialize progress tracker
- `POST /progress/complete-day` - Mark day as complete

### AI Features
- `POST /explain/` - Get AI explanation
- `POST /resources/` - Get learning resources

### Notes
- `GET /notes/` - Get all notes
- `POST /notes/` - Create new note

## Authentication Flow

1. User signs up → JWT token generated
2. Token stored in localStorage
3. All API requests include token in Authorization header
4. Backend validates token and returns user-specific data
5. Logout removes token from localStorage

## Database Schema

### users
- id (PK)
- email (unique)
- hashed_password
- created_at

### study_plans
- id (PK)
- user_id (FK → users)
- subject
- weak_areas
- deadline_days
- plan_data (JSON)
- created_at
