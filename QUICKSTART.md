# Quick Start Guide

## Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL installed and running

## 1. Database Setup (One-time)
```bash
# Create database and user
psql -U postgres -c "CREATE DATABASE edumentor_db;"
psql -U postgres -c "CREATE USER edumentor_user WITH PASSWORD 'edumentor_pass';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE edumentor_db TO edumentor_user;"
```

## 2. Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create database tables
python create_tables.py

# Start server
uvicorn main:app --reload
```

Backend runs at: **http://127.0.0.1:8000**

## 3. Frontend Setup (New Terminal)
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

## 4. Test the App
1. Open http://localhost:5173
2. Click "Sign up" to create an account
3. Login with your credentials
4. Start using the features!

## Features Available
- 📅 **Planner** - AI-generated study plans
- 📊 **Dashboard** - Track your progress
- 🧠 **Quiz** - Test your knowledge
- 🤖 **AI Explain** - Get simple explanations
- 📚 **Resources** - Find learning materials
- 📝 **Notes** - Save your notes

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `psql -U postgres -c "SELECT 1;"`
- Verify DATABASE_URL in `backend/.env`
- Make sure all dependencies installed: `pip install -r requirements.txt`

### Frontend won't start
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node version: `node --version` (should be 16+)

### Can't login
- Check backend is running at http://127.0.0.1:8000
- Check browser console for errors
- Verify database tables exist: `python backend/create_tables.py`

### API errors
- Check CORS settings in `backend/main.py`
- Verify frontend is calling correct backend URL
- Check browser Network tab for failed requests
