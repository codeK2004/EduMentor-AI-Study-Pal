#!/usr/bin/env python3
"""
Manual table creation script for plan_progress
"""

from sqlalchemy import text
from database.session import engine

def create_plan_progress_table():
    print("🔄 Creating plan_progress table...")
    
    sql = """
    CREATE TABLE IF NOT EXISTS plan_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        plan_id INTEGER NOT NULL REFERENCES study_plans(id),
        total_days INTEGER DEFAULT 0,
        completed_days INTEGER DEFAULT 0,
        completed_day_numbers TEXT DEFAULT '',
        is_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_plan_progress_user_plan ON plan_progress(user_id, plan_id);
    """
    
    try:
        with engine.connect() as conn:
            conn.execute(text(sql))
            conn.commit()
        print("✅ plan_progress table created successfully!")
    except Exception as e:
        print(f"❌ Error creating table: {e}")

if __name__ == "__main__":
    create_plan_progress_table()