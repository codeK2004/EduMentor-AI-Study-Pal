# Quick Fix for Real-Time Progress Tracking

## Step 1: Create the Progress Table

Run this command in your terminal:

```bash
psql -U postgres -d edumentor_db -f backend/create_progress_table.sql
```

Or manually run:

```bash
psql -U postgres -d edumentor_db
```

Then paste this SQL:

```sql
CREATE TABLE IF NOT EXISTS progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    study_plan_id INTEGER NOT NULL REFERENCES study_plans(id),
    total_days INTEGER DEFAULT 0,
    completed_days INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

GRANT ALL PRIVILEGES ON TABLE progress TO edumentor_user;
GRANT USAGE, SELECT ON SEQUENCE progress_id_seq TO edumentor_user;

CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_study_plan_id ON progress(study_plan_id);
```

Type `\q` to exit psql.

## Step 2: Restart Backend

The backend should automatically reload if you're using `--reload` flag.

If not, restart it:

```bash
cd backend
uvicorn main:app --reload
```

## Step 3: Test It!

1. Go to your app (http://localhost:5173)
2. Create a new study plan
3. Click on tasks to complete them
4. Watch the Dashboard update in real-time! ✨

## What's Fixed:

✅ **Real-time progress updates** - Progress updates immediately when you complete tasks
✅ **Persistent storage** - Progress saved to database, not lost on restart  
✅ **User-specific tracking** - Each user has their own progress
✅ **Plan-specific tracking** - Progress tracked separately for each plan
✅ **Auto-refresh dashboard** - Dashboard refreshes every 5 seconds

## How It Works Now:

1. **Complete a task** → PlanCard updates backend immediately
2. **Backend saves** → Progress stored in PostgreSQL database
3. **Dashboard refreshes** → Shows updated progress automatically
4. **Data persists** → Even after page refresh or server restart

Enjoy your real-time progress tracking! 🚀
