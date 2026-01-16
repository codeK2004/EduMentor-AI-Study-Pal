# Database Migration Guide

## New Progress Tracking System

We've upgraded the progress tracking system to use the database instead of in-memory storage. This means progress is now:
- ✅ Persistent across server restarts
- ✅ User-specific
- ✅ Plan-specific
- ✅ Real-time updates

## Migration Steps

### 1. Stop the Backend Server
```bash
# Press Ctrl+C in the terminal running uvicorn
```

### 2. Create New Database Table
```bash
cd backend
python create_tables.py
```

This will create the new `progress` table in your database.

### 3. Restart the Backend Server
```bash
cd backend
uvicorn main:app --reload
```

### 4. Test the New System
1. Create a new study plan
2. Complete some tasks in the plan
3. Check the Dashboard - progress should update in real-time
4. Refresh the page - progress should persist

## What Changed

### Backend Changes:
- ✅ New `Progress` model in `backend/models/progress.py`
- ✅ Updated `backend/routes/progress.py` to use database
- ✅ Updated `backend/routes/study_plan.py` to return plan_id
- ✅ Progress now tracked per user and per plan

### Frontend Changes:
- ✅ Updated `PlanCard` component to update progress when tasks are completed
- ✅ Updated `Planner` to pass plan_id to progress tracking
- ✅ Updated `MyPlans` to support real-time progress updates
- ✅ Updated `Dashboard` to auto-refresh every 5 seconds

## Benefits

1. **Real-time Updates**: Progress updates immediately when you complete tasks
2. **Persistent Data**: Progress is saved to database, not lost on server restart
3. **User-specific**: Each user has their own progress tracking
4. **Plan-specific**: Progress is tracked separately for each study plan
5. **Accurate Stats**: Dashboard shows real, up-to-date statistics

## Troubleshooting

### If progress doesn't update:
1. Check browser console for errors
2. Verify backend is running
3. Check that the progress table was created: `psql -U edumentor_user -d edumentor_db -c "\dt"`
4. Restart both frontend and backend

### If you see database errors:
1. Make sure you ran `python create_tables.py`
2. Check that PostgreSQL is running
3. Verify database credentials in `.env` file
