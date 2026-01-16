# EduMentor AI - Setup Guide

## Backend Setup

### 1. Install PostgreSQL
Make sure PostgreSQL is installed and running on your system.

### 2. Create Database
```bash
psql -U postgres
CREATE DATABASE edumentor_db;
CREATE USER edumentor_user WITH PASSWORD 'edumentor_pass';
GRANT ALL PRIVILEGES ON DATABASE edumentor_db TO edumentor_user;
\q
```

### 3. Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 4. Create Database Tables
```bash
cd backend
python create_tables.py
```

### 5. Start Backend Server
```bash
cd backend
uvicorn main:app --reload
```

Backend will run on: http://127.0.0.1:8000

## Frontend Setup

### 1. Install Node Dependencies
```bash
cd frontend
npm install
```

### 2. Start Frontend Dev Server
```bash
cd frontend
npm run dev
```

Frontend will run on: http://localhost:5173

## Testing the Application

1. Open http://localhost:5173 in your browser
2. Sign up with a new account
3. Login and start using the features:
   - Create study plans
   - Take quizzes
   - Track progress
   - Get AI explanations
   - Find resources
   - Save notes

## Environment Variables

The `.env` file in the backend folder contains:
- `GEMINI_API_KEY` - Your Google Gemini API key
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT secret key (change in production!)
- `ALGORITHM` - JWT algorithm (HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc
