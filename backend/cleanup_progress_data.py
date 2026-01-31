#!/usr/bin/env python3
"""
Cleanup script to ensure all progress data is in the correct JSON format
"""

from database.session import get_db
from models.user_progress import UserProgress
import json

def cleanup_progress_data():
    print("🔄 Cleaning up progress data...")
    
    db = next(get_db())
    
    try:
        # Get all user progress records
        all_progress = db.query(UserProgress).all()
        
        updated_count = 0
        
        for progress in all_progress:
            if progress.completed_day_numbers:
                try:
                    # Try to parse as JSON
                    data = json.loads(progress.completed_day_numbers)
                    if isinstance(data, dict):
                        # Already in correct format
                        continue
                    else:
                        # Not a dict, reset to empty
                        progress.completed_day_numbers = "{}"
                        updated_count += 1
                except (json.JSONDecodeError, ValueError):
                    # Not valid JSON, reset to empty
                    progress.completed_day_numbers = "{}"
                    updated_count += 1
            else:
                # Empty or None, set to empty JSON
                progress.completed_day_numbers = "{}"
                updated_count += 1
        
        if updated_count > 0:
            db.commit()
            print(f"✅ Updated {updated_count} progress records to correct format")
        else:
            print("✅ All progress records are already in correct format")
            
    except Exception as e:
        print(f"❌ Error cleaning up data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    cleanup_progress_data()