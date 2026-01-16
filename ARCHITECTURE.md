# EduMentor AI - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                    (React + Vite)                            │
│                  http://localhost:5173                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Login      │  │   Signup     │  │   Logout     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Auth Utility (utils/auth.js)            │  │
│  │  - Store JWT token in localStorage                   │  │
│  │  - Check if user is authenticated                    │  │
│  │  - Remove token on logout                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Utility (utils/api.js)              │  │
│  │  - Axios instance with baseURL                       │  │
│  │  - Auto-attach JWT token to all requests            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─────────┐ ┌─────────┐ ┌──────┐ ┌─────────┐ ┌────────┐ │
│  │ Planner │ │Dashboard│ │ Quiz │ │AI Explain│ │Resources│ │
│  └─────────┘ └─────────┘ └──────┘ └─────────┘ └────────┘ │
│                                                              │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ HTTP Requests with JWT Token
                       │ Authorization: Bearer <token>
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                         BACKEND                              │
│                   (FastAPI + Python)                         │
│                 http://127.0.0.1:8000                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  CORS Middleware                      │  │
│  │  - Allow frontend origin (localhost:5173)            │  │
│  │  - Allow credentials (cookies, auth headers)         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Auth Routes (/auth)                      │  │
│  │  POST /auth/signup  - Create account                 │  │
│  │  POST /auth/login   - Login and get JWT token        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         JWT Authentication Dependency                 │  │
│  │  (utils/dependencies.py)                             │  │
│  │  - Extract token from Authorization header           │  │
│  │  - Verify token signature                            │  │
│  │  - Get user from database                            │  │
│  │  - Return user object or 401 error                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Protected Routes (require auth)               │  │
│  │  /study/plan        - Create study plan              │  │
│  │  /study/plans       - List user's plans              │  │
│  │  /study/plans/{id}  - Get specific plan              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Public Routes (no auth required)              │  │
│  │  /quiz/generate     - Generate quiz                  │  │
│  │  /progress/*        - Progress tracking              │  │
│  │  /explain/          - AI explanations                │  │
│  │  /resources/        - Learning resources             │  │
│  │  /notes/*           - Notes management               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              AI Integration (ai/gemini.py)            │  │
│  │  - Google Gemini API                                 │  │
│  │  - Generate study plans                              │  │
│  │  - Generate quiz questions                           │  │
│  │  - Provide explanations                              │  │
│  │  - Suggest resources                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ SQL Queries
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                      PostgreSQL                              │
│                   (Database Server)                          │
│                  localhost:5432/edumentor_db                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    users table                        │  │
│  │  - id (primary key)                                  │  │
│  │  - email (unique)                                    │  │
│  │  - hashed_password                                   │  │
│  │  - created_at                                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                study_plans table                      │  │
│  │  - id (primary key)                                  │  │
│  │  - user_id (foreign key → users.id)                 │  │
│  │  - subject                                           │  │
│  │  - weak_areas                                        │  │
│  │  - deadline_days                                     │  │
│  │  - plan_data (JSON)                                  │  │
│  │  - created_at                                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
1. User Signup/Login
   ┌─────────┐
   │ Browser │
   └────┬────┘
        │ POST /auth/signup or /auth/login
        │ { email, password }
        ▼
   ┌─────────────┐
   │   Backend   │
   │             │
   │ 1. Hash password (Argon2)
   │ 2. Save/verify user in PostgreSQL
   │ 3. Generate JWT token
   │ 4. Return { access_token, token_type }
   └────┬────┘
        │
        ▼
   ┌─────────┐
   │ Browser │
   │         │
   │ Store token in localStorage
   └─────────┘

2. Authenticated Request
   ┌─────────┐
   │ Browser │
   └────┬────┘
        │ POST /study/plan
        │ Headers: { Authorization: "Bearer <token>" }
        │ Body: { subject, weak_areas, deadline_days }
        ▼
   ┌─────────────┐
   │   Backend   │
   │             │
   │ 1. Extract token from header
   │ 2. Verify token signature
   │ 3. Decode user_id from token
   │ 4. Query user from database
   │ 5. Execute route logic with user context
   │ 6. Return user-specific data
   └────┬────┘
        │
        ▼
   ┌─────────┐
   │ Browser │
   │         │
   │ Display data to user
   └─────────┘

3. Logout
   ┌─────────┐
   │ Browser │
   │         │
   │ Remove token from localStorage
   │ Redirect to login page
   └─────────┘
```

## Data Flow Example: Creating a Study Plan

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User fills form in Planner.jsx                           │
│    - Subject: "Python"                                      │
│    - Weak areas: "loops, functions"                         │
│    - Days: 7                                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Frontend (api.js)                                        │
│    - Get token from localStorage                            │
│    - POST /study/plan                                       │
│    - Headers: { Authorization: "Bearer <token>" }           │
│    - Body: { subject, weak_areas, deadline_days }           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Backend (routes/study_plan.py)                          │
│    - Verify JWT token → get user                            │
│    - Build AI prompt                                        │
│    - Call Gemini API                                        │
│    - Parse JSON response                                    │
│    - Save to PostgreSQL (study_plans table)                 │
│    - Return plan data                                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Frontend (Planner.jsx)                                   │
│    - Receive plan data                                      │
│    - Render PlanCard components                             │
│    - Initialize progress tracker                            │
└─────────────────────────────────────────────────────────────┘
```

## Security Layers

1. **Password Security**
   - Passwords hashed with Argon2 (industry standard)
   - Never stored in plain text
   - Verified using secure comparison

2. **JWT Token Security**
   - Signed with SECRET_KEY
   - Contains user_id in payload
   - Expires after 60 minutes
   - Verified on every protected route

3. **CORS Protection**
   - Only allows requests from localhost:5173
   - Credentials must be included
   - Prevents unauthorized origins

4. **Database Security**
   - User-specific queries (user_id filter)
   - SQL injection protection (SQLAlchemy ORM)
   - Foreign key constraints

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **Recharts** - Data visualization

### Backend
- **FastAPI** - Web framework
- **SQLAlchemy** - ORM
- **PostgreSQL** - Database
- **Pydantic** - Data validation
- **python-jose** - JWT handling
- **passlib** - Password hashing
- **Google Gemini** - AI generation

### DevOps
- **uvicorn** - ASGI server
- **python-dotenv** - Environment variables
