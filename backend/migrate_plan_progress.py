#!/usr/bin/env python3
"""
Migration script to create the new plan_progress table and migrate existing data
"""

from database.session import engine, get_db
from database.base import Base
from sqlalchemy.orm import Session
from sqlalchemy import text

# Import models to ensure they're registered
import models.user
import models.study_plan
import models.progress
import models.plan_progress
import models.user_progress

def migrate():
    print("🔄 Starting migration...")
    
    # Create new tables
    Base.metadata.create_all(bind=engine)
    print("✅ New tables created")
    
    # Get database session
    db = next(get_db())
    
    try:
        # Check if we need to migrate existing data
        from models.user_progress import UserProgress
        from models.study_plan import StudyPlan
        from models.plan_progress import PlanProgress
        
        # Get all existing user progress
        existing_progress = db.query(UserProgress).all()
        
        if existing_progress:
            print(f"📊 Found {len(existing_progress)} existing progress records")
            
            for user_prog in existing_progress:
                # Get all study plans for this user
                user_plans = db.query(StudyPlan).filter(StudyPlan.user_id == user_prog.user_id).all()
                
                if user_plans:
                    print(f"👤 Migrating progress for user {user_prog.user_id} with {len(user_plans)} plans")
                    
                    # Create plan-specific progress for each plan
                    for plan in user_plans:
                        # Check if plan progress already exists
                        existing_plan_progress = db.query(PlanProgress).filter(
                            PlanProgress.user_id == user_prog.user_id,
                            PlanProgress.plan_id == plan.id
                        ).first()
                        
                        if not existing_plan_progress:
                            total_days = len(plan.plan_data.get("days", [])) if plan.plan_data else 0
                            
                            plan_progress = PlanProgress(
                                user_id=user_prog.user_id,
                                plan_id=plan.id,
                                total_days=total_days,
                                completed_days=0,  # Reset to 0 for clean start
                                completed_day_numbers="",
                                is_completed=False
                            )
                            db.add(plan_progress)
                            print(f"  ✅ Created progress for plan {plan.id} ({plan.subject})")
            
            db.commit()
            print("✅ Migration completed successfully")
        else:
            print("ℹ️  No existing progress to migrate")
            
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    migrate()