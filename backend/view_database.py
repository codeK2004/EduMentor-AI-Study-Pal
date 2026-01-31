#!/usr/bin/env python3
"""
Quick Database Viewer for EduMentor AI
Run this script to see all stored data in a nice format
"""

import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import json
from datetime import datetime

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

def print_header(title):
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def print_table_data(title, query, headers=None):
    print_header(title)
    
    try:
        with engine.connect() as conn:
            result = conn.execute(text(query))
            rows = result.fetchall()
            
            if not rows:
                print("  No data found.")
                return
            
            # Print headers
            if headers:
                print("  " + " | ".join(f"{h:<15}" for h in headers))
                print("  " + "-" * (len(headers) * 18))
            
            # Print data
            for row in rows:
                formatted_row = []
                for item in row:
                    if isinstance(item, datetime):
                        formatted_row.append(item.strftime("%Y-%m-%d %H:%M"))
                    elif isinstance(item, dict):
                        formatted_row.append("JSON_DATA")
                    elif item is None:
                        formatted_row.append("NULL")
                    else:
                        formatted_row.append(str(item)[:15])
                
                print("  " + " | ".join(f"{item:<15}" for item in formatted_row))
                
    except Exception as e:
        print(f"  Error: {e}")

def main():
    print("🗄️  EduMentor AI - Database Viewer")
    print("="*60)
    
    # Check connection
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("✅ Database connection successful!")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return
    
    # Show all tables and their row counts
    print_header("📊 TABLE OVERVIEW")
    tables = [
        "users", "study_plans", "user_progress", 
        "saved_quizzes", "saved_resources", "saved_explanations", "user_notes"
    ]
    
    for table in tables:
        try:
            with engine.connect() as conn:
                result = conn.execute(text(f"SELECT COUNT(*) FROM {table}"))
                count = result.fetchone()[0]
                print(f"  {table:<20} : {count:>5} rows")
        except Exception as e:
            print(f"  {table:<20} : ERROR - {e}")
    
    # Show detailed data
    print_table_data(
        "👥 USERS",
        "SELECT id, email, created_at FROM users ORDER BY created_at DESC LIMIT 10",
        ["ID", "Email", "Created"]
    )
    
    print_table_data(
        "📚 STUDY PLANS",
        "SELECT id, user_id, subject, deadline_days, created_at FROM study_plans ORDER BY created_at DESC LIMIT 10",
        ["ID", "User ID", "Subject", "Days", "Created"]
    )
    
    print_table_data(
        "📈 USER PROGRESS",
        """SELECT up.id, up.user_id, up.completed_days, up.total_days
           FROM user_progress up 
           ORDER BY up.id DESC LIMIT 10""",
        ["ID", "User ID", "Completed", "Total"]
    )
    
    print_table_data(
        "🧠 SAVED QUIZZES",
        """SELECT id, user_id, topic, score, total_questions, created_at
           FROM saved_quizzes ORDER BY created_at DESC LIMIT 10""",
        ["ID", "User ID", "Topic", "Score", "Total", "Created"]
    )
    
    print_table_data(
        "📖 SAVED RESOURCES",
        "SELECT id, user_id, title, category, created_at FROM saved_resources ORDER BY created_at DESC LIMIT 10",
        ["ID", "User ID", "Title", "Category", "Created"]
    )
    
    print_table_data(
        "🤖 SAVED EXPLANATIONS",
        "SELECT id, user_id, topic, created_at FROM saved_explanations ORDER BY created_at DESC LIMIT 10",
        ["ID", "User ID", "Topic", "Created"]
    )
    
    print_table_data(
        "📝 USER NOTES",
        "SELECT id, user_id, title, category, created_at FROM user_notes ORDER BY created_at DESC LIMIT 10",
        ["ID", "User ID", "Title", "Category", "Created"]
    )
    
    # Show summary statistics
    print_header("📊 SUMMARY STATISTICS")
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT 
                    (SELECT COUNT(*) FROM users) as total_users,
                    (SELECT COUNT(*) FROM study_plans) as total_plans,
                    (SELECT COUNT(*) FROM saved_quizzes) as total_quizzes,
                    (SELECT COUNT(*) FROM saved_resources) as total_resources,
                    (SELECT COUNT(*) FROM user_notes) as total_notes
            """))
            stats = result.fetchone()
            
            print(f"  Total Users:           {stats[0]}")
            print(f"  Total Study Plans:     {stats[1]}")
            print(f"  Total Quizzes Taken:   {stats[2]}")
            print(f"  Total Resources Saved: {stats[3]}")
            print(f"  Total Notes Created:   {stats[4]}")
            
    except Exception as e:
        print(f"  Error getting statistics: {e}")
    
    print("\n" + "="*60)
    print("✅ Database view complete!")
    print("="*60)

if __name__ == "__main__":
    main()